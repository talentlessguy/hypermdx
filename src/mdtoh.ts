import { h as hyperscript } from 'hyperapp'
import md from 'remark-parse'
import toHast from 'mdast-util-to-hast'
import toH from 'hast-to-hyperscript'
import unified from 'unified'

type Node = {
  type: string
  props?: Record<string, any>
  children?: any[]
}

export type PluginOptions = Partial<{ components: Record<string, any>; h: any; remarkPlugins: any[] }>

export function plugin({ components, h = hyperscript }: PluginOptions) {
  this.Compiler = (node: Node) => toH(w, toHast(node))

  // Wrapper around `h` to pass components in.
  const w = (name: string, props: Record<string, any>, children: any[] | string) => {
    const id = name.toLowerCase()

    const fn = id in components ? components[id] : h

    return fn(name, props || {}, children)
  }
}

export async function transformTree(content: string, options?: PluginOptions): Promise<any> {
  const { remarkPlugins, ...opts } = options

  return await unified()
    .use(md)
    .use(remarkPlugins || [])
    .use(plugin, opts)
    .process(content)
}
