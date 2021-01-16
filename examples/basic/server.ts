import { App } from '@tinyhttp/app'
import { h, text } from 'hyperapp'
import { renderToStream } from 'hyperapp-render'

import { hypermdx } from '../dist/index.js'

const Component = (children: string) => h('h3', { style: { color: 'red' } }, text(children))

const md = hypermdx({
  components: {
    h1: (n: string, p: Record<string, any>, c: any[]) => {
      return h(n, { style: { color: 'blue' }, ...p }, c)
    }
  }
})

const content = await md`
# This is a custom heading defined in components

- this is a list
- yet another list

${Component('custom component')}
    `

new App()
  .get(async (_req, res) => {
    renderToStream(await content).pipe(res)
  })
  .listen(3000)
