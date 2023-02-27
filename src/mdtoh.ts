import { toH } from 'hast-to-hyperscript'
import type { Element } from 'hast-to-hyperscript/lib/index'
import { h as hyperscript, MaybeVNode, text, VNode } from 'hyperapp'
import { toHast } from 'mdast-util-to-hast'
import md from 'remark-parse'
import { PluggableList, unified, VFileWithOutput } from 'unified'

type Children = MaybeVNode<unknown> | readonly MaybeVNode<unknown>[]

export type PluginOptions = Partial<{
  components: Record<string, (name: string, props: Record<string, unknown>, children?: Children) => VNode<unknown>>
  h: typeof hyperscript
  remarkPlugins: PluggableList
}>

type ArgumentsType<T extends (...args: unknown[]) => unknown> = T extends (...args: infer A) => unknown ? A : never

export function plugin({ components = {}, h = hyperscript }: PluginOptions) {
  this.Compiler = (node: ArgumentsType<typeof toHast>[0]) => {
    return toH(w, toHast(node) as Element)
  }

  // Wrapper around `h` to pass components in
  const w = (name: string, props: Record<string, unknown>, children: Children) => {
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

export const async = async (content: string, options?: PluginOptions): Promise<VFileWithOutput<unknown>> =>
  await transformTree(options).process(content)

export const sync = (content: string, options?: PluginOptions): VFileWithOutput<unknown> =>
  transformTree(options).processSync(content)
