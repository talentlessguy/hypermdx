import { h } from 'hyperapp'
import * as transform from './mdtoh'
import type { PluginOptions } from './mdtoh'

type Children = any[] | TemplateStringsArray

type HyperMDXOptions = PluginOptions

export const async = (opts?: HyperMDXOptions) => async (...children: Children) => {
  const els = []

  for (const child of children) {
    if (Array.isArray(child) && child.every((c) => typeof c === 'string')) {
      els.push((await transform.async(child.join(''), opts)).result)
    } else {
      els.push(typeof child === 'string' ? (await transform.async(child)).result : child)
    }
  }

  return h('div', {}, els)
}

export const hypermdx = (opts?: HyperMDXOptions) => (...children: Children) => {
  const els = []

  for (const child of children) {
    if (Array.isArray(child) && child.every((c) => typeof c === 'string')) {
      els.push(transform.sync(child.join(''), opts).result)
    } else {
      els.push(typeof child === 'string' ? transform.sync(child).result : child)
    }
  }

  return h('div', {}, els)
}

export const HyperMDX = (props: HyperMDXOptions & Partial<{ remarkPlugins: any[] }>, children: Children) =>
  hypermdx(props)(children)
