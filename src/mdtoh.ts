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

export function plugin(options: Partial<{ components: Record<string, any>; h: any }> = {}) {
  const h = options?.h || hyperscript

  this.Compiler = (node: Node) => toH(w, toHast(node))

  // Wrapper around `h` to pass components in.
  const w = (name: string, props: Record<string, any>, children: any[] | string) => {
    return h(name, props || {}, children)
  }
}

export async function transformTree(content: string, remarkPlugins?: any[]): Promise<any> {
  return await unified()
    .use(md)
    .use(remarkPlugins || [])
    .use(plugin)
    .process(content)
}
