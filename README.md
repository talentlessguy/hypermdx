# HyperMDX

[![npm-badge]][npm-url] [![dl-badge]][npm-url]

 <img src="https://github.com/talentlessguy/hypermdx/blob/master/logo.png" width="150px" align="right" />

Markdown enhanced with [Hyperapp](https://github.com/jorgebucaran/hyperapp).

## Install

```sh
pnpm i hypermdx
```

## Example

```js
import { App } from '@tinyhttp/app'
import { h, text } from 'hyperapp'
import { renderToStream } from 'hyperapp-render'

import hypermdx from 'hypermdx'

const Component = (children: string) => h('h3', { style: { color: 'red' } }, text(children))

const md = hypermdx({
  components: {
    h1: (n, p, c) => {
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

new App().get(async (_, res) => renderToStream(await content).pipe(res)).listen(3000)
```

Output:

```html
<div>
  <div>
    <h1 style="color:blue">This is a custom heading defined in components</h1>
    <ul>
      <li>
        <p>this is a list</p>
      </li>
      <li>
        <p>yet another list</p>
      </li>
    </ul>
  </div>
  <h3 style="color:red">custom component</h3>
</div>
```

## API

### `hypermdx(options)`

Creates an function to render markdown and components.

```js
const mdx = hypermdx()

await md('Hello World', Component('hello'))
```

Additionally it supports template strings.

```js
const mdx = hypermdx()

await md`
# Hello World
${Component('hello')}
`
```

### Options

#### components

- Default: `{}`

Custom components to be used instead of default HTML tags.

```js
const md = hypermdx({
  components: {
    h1: (name, props, children) => h(name, { style: { color: 'blue' }, ...props }, children)
  }
})
```

#### h

- Default: hyperapp's `h`

Hyperscript function to use.

#### remarkPlugins

- Default: `[]`

Additional [Remark](https://github.com/remarkjs/remark) plugins.

```js
import hypermdx from 'hypermdx'
import capitalize from 'remark-capitalize'
import emoji from 'remark-emoji'

const md = hypermdx({ remarkPlugins: [emoji, capitalize] })
```

### `sync(options)`

Same as `hypermdx` but instead, it returns a sync function.

```js
import { sync as hypermdx } from 'hypermdx'

const md = hypermdx()

md`
# Hello World
`
```

[npm-badge]: https://img.shields.io/npm/v/hypermdx?style=flat-square&color=%234AB8F2
[dl-badge]: https://img.shields.io/npm/dt/hypermdx?style=flat-square&color=%234AB8F2
[npm-url]: https://npmjs.com/package/hypermdx
