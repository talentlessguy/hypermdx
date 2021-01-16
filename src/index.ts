import { h } from 'hyperapp'
import * as transform from './mdtoh'
import type { PluginOptions } from './mdtoh'

type Children = any[] | TemplateStringsArray

type HyperMDXOptions = PluginOptions

const hypermdx = (opts?: HyperMDXOptions) => async (...children: Children) => {
  const els = []

  for (const child of children) {
    if (Array.isArray(child) && child.every((c) => typeof c === 'string')) {
      els.push((await transform.async(child.join(''), opts)).result)
    } else if (typeof child === 'string') {
      els.push((await transform.async(child)).result)
    } else {
      els.push(child)
    }
  }

  return h('div', {}, els)
}

export const sync = (opts?: HyperMDXOptions) => (...children: Children) => {
  const els = []

  for (const child of children) {
    if (Array.isArray(child) && child.every((c) => typeof c === 'string')) {
      els.push(transform.sync(child.join(''), opts).result)
    } else if (typeof child === 'string') {
      els.push(transform.sync(child).result)
    } else {
      els.push(child)
    }
  }

  return h('div', {}, els)
}

export default hypermdx

export const HyperMDX = (props: HyperMDXOptions & Partial<{ remarkPlugins: any[] }>, children: Children) =>
  hypermdx(props)(children)
