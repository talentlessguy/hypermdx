import { h as hyperscript, VNode, text } from 'hyperapp'
import md from 'remark-parse'
import toHast from 'mdast-util-to-hast'
import toH from 'hast-to-hyperscript'
import unified from 'unified'

type Node = {
  type: string
  props?: Record<string, any>
  children?: any[]
}

export type PluginOptions = Partial<{
  components: Record<string, (name: string, props: Record<string, any>, children?: any) => VNode<any>>
  h: any
  remarkPlugins: any[]
}>

export function plugin({ components = {}, h = hyperscript }: PluginOptions) {
  this.Compiler = (node: Node) => toH(w, toHast(node))

  // Wrapper around `h` to pass components in
  const w = (name: string, props: Record<string, any>, children: any[] | string) => {
    const id = name.toLowerCase()

    props = props || {}

    if (Array.isArray(children) && children.some((child) => typeof child === 'string')) {
      const newChildren = []

      for (const child of children) {
        if (typeof child === 'string') {
          newChildren.push(text(child))
        } else {
          newChildren.push(child)
        }
      }

      return h(name, props, newChildren)
    } else if (id in components) {
      return components[id](name, props, children)
    } else {
      return h(name, props, children)
    }
  }
}

function transformTree(options: PluginOptions = {}) {
  const { remarkPlugins, ...opts } = options

  return unified()
    .use(md)
    .use(remarkPlugins || [])
    .use(plugin, opts)
}

export async function async(content: string, options?: PluginOptions): Promise<any> {
  return await transformTree(options).process(content)
}

export function sync(content: string, options?: PluginOptions): any {
  return transformTree(options).processSync(content)
}
