import { hypermdx } from 'hypermdx'
import capitalize from 'remark-capitalize'
import emoji from 'remark-emoji'
import { renderToString } from 'hyperapp-render'

const md = hypermdx({ remarkPlugins: [emoji, capitalize] })

const view = md`
# hello :dog:

some text
`

console.log(renderToString(view))
