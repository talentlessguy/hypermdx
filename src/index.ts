import { h } from 'hyperapp'
import { PluginOptions, transformTree } from './mdtoh'

type Children = any[] | TemplateStringsArray

export const hypermdx = (opts?: PluginOptions) => async (...children: Children) => {
  const els = []

  for (const child of children) {
    if (Array.isArray(child) && child.every((c) => typeof c === 'string')) {
      els.push((await transformTree(child.join(''), opts)).result)
    } else if (typeof child === 'string') {
      els.push((await transformTree(child, opts)).result)
    } else {
      els.push(child)
    }
  }

  return h('div', {}, els)
}

export const HyperMDX = (props: PluginOptions & Partial<{ remarkPlugins: any[] }>, children: Children) =>
  hypermdx(props)(children)
