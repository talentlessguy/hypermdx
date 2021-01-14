import { h, VNode } from 'hyperapp'
import { transformTree } from './mdtoh'

export const hypermdx = async <S = any>(children: VNode<S>[], remarkPlugins?: any[]) => {
  const els = []

  for (const child of children) {
    els.push(typeof child === 'string' ? await transformTree(child, remarkPlugins) : child)
  }

  return h('div', {}, els)
}

export type Props = Partial<{
  remarkPlugins: any[]
}>

export const HyperMDX = (props: Props, children: VNode<any>[]) => hypermdx(children, props.remarkPlugins)
