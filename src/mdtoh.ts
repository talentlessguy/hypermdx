import { h as hyperscript, VNode } from 'hyperapp'
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

    return (id in components ? components[id] : h)(name, props || {}, children)
  }
}

function transformTree(options?: PluginOptions) {
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
