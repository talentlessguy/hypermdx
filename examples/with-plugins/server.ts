import { renderToString } from 'hyperapp-render'
import { hypermdx } from 'hypermdx'
import capitalize from 'remark-capitalize'
import emoji from 'remark-emoji'

const md = hypermdx({ remarkPlugins: [emoji, capitalize] })

const view = md`
# hello :dog:

some text
`

console.log(renderToString(view))
