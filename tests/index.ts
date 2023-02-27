import { h, text } from 'hyperapp'
import { deepEqual } from 'node:assert/strict'
import { describe, it } from 'node:test'
import { hypermdx } from '../src/index'

describe('rendering', () => {
  const md = hypermdx()

  it('renders basic markdown', () => {
    const result = md`
# hello world
    `
    deepEqual(result, {
      children: [
        {
          children: [
            {
              children: [],
              key: undefined,
              node: undefined,
              props: {},
              tag: 'hello world',
              type: 3
            }
          ],
          key: undefined,
          node: undefined,
          props: {},
          tag: 'h1',
          type: undefined
        }
      ],
      key: undefined,
      node: undefined,
      props: {},
      tag: 'div',
      type: undefined
    })
  })

  it('supports embedding hyperapp components', () => {
    const Component = (children: string) => h('h3', { style: { color: 'red' } }, text(children))

    const result = md`
  # hello world
  
  ${Component('component')}
    `
    deepEqual(
      result.children.find((c) => c && typeof c !== 'boolean' && c.tag === 'h3'),
      {
        tag: 'h3',
        props: { style: { color: 'red' } },
        key: undefined,
        children: [
          {
            tag: 'component',
            props: {},
            key: undefined,
            children: [],
            type: 3,
            node: undefined
          }
        ],
        type: undefined,
        node: undefined
      }
    )
  })
})
