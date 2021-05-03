import { h as hyperscript, VNode, text } from 'hyperapp'
import md from 'remark-parse'
import { toHast } from 'mdast-util-to-hast'
import { toH, Element } from 'hast-to-hyperscript'
import unified from 'unified'

export type PluginOptions = Partial<{
  components: Record<string, (name: string, props: Record<string, any>, children?: any) => VNode<any>>
  h: typeof hyperscript
  remarkPlugins: any[]
}>

type ArgumentsType<T extends (...args: any[]) => any> = T extends (...args: infer A) => any ? A : never

export function plugin({ components = {}, h = hyperscript }: PluginOptions) {
  this.Compiler = (node: ArgumentsType<typeof toHast>[0]) => {
    return toH(w, toHast(node) as Element)
  }

  // Wrapper around `h` to pass components in
  const w = (name: string, props: Record<string, any>, children: any) => {
    const id = name.toLowerCase()

    props = props || {}

    if (Array.isArray(children) && children.some((child) => typeof child === 'string')) {
      const newChildren = []

      for (const child of children) newChildren.push(typeof child === 'string' ? text(child) : child)

      return h(name, props, newChildren)
    } else if (id in components) return components[id](name, props, children)
    else return h(name, props, children)
  }
}

function transformTree(options: PluginOptions = {}) {
  const { remarkPlugins, ...opts } = options

  return unified()
    .use(md)
    .use(remarkPlugins || [])
    .use(plugin, opts)
}

export const async = async (content: string, options?: PluginOptions): Promise<any> =>
  await transformTree(options).process(content)

export const sync = (content: string, options?: PluginOptions): any => transformTree(options).processSync(content)
