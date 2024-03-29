# HyperMDX

[![npm-badge]][npm-url] [![dl-badge]][npm-url] [![Coveralls][cov-badge-url]][cov-url]

 <img src="https://raw.githubusercontent.com/talentlessguy/hypermdx/master/logo.png" width="150px" align="right" />

HyperMDX is an MDX-like library to enhance markdown with [Hyperapp](https://github.com/jorgebucaran/hyperapp).

## Features

- Custom components for HTML elements
- Embed Hyperapp components inside a page
- Async and sync modes
- Remark plugins support

## Install

```sh
pnpm i hypermdx
```

## Example

```js
import { App } from '@tinyhttp/app'
import { h, text } from 'hyperapp'
import { renderToStream } from 'hyperapp-render'
import { hypermdx } from 'hypermdx'

const Component = (children: string) => h('h3', { style: { color: 'red' } }, text(children))

const md = hypermdx({
  components: {
    h1: (n, p, c) => h(n, { style: { color: 'blue' }, ...p }, c)
  }
})

const content = md`
# This is a custom heading defined in components

- this is a list
- yet another list

${Component('custom component')}
    `

new App().get(async (_, res) => renderToStream(content).pipe(res)).listen(3000)
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

md('Hello World', Component('hello'))
```

Additionally it supports template strings.

```js
const mdx = hypermdx()

md`
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

- Default: `hyperapp.h`

Hyperscript function.

```js
import { hyperscript2 } from 'my-own-lib'

const md = hypermdx({ h: hyperscript2 })

md`
# Hello World
`
```

#### remarkPlugins

- Default: `[]`

Additional [Remark](https://github.com/remarkjs/remark) plugins.

```js
import hypermdx from 'hypermdx'
import capitalize from 'remark-capitalize'
import emoji from 'remark-emoji'

const md = hypermdx({ remarkPlugins: [emoji, capitalize] })
```

### `async(options)`

Same as `hypermdx` but instead, it returns an async function.

```js
import { async as hypermdx } from 'hypermdx'

const md = hypermdx()

await md`
# Hello World
`
```

[npm-badge]: https://img.shields.io/npm/v/hypermdx?style=flat-square&color=%234AB8F2
[dl-badge]: https://img.shields.io/npm/dt/hypermdx?style=flat-square&color=%234AB8F2
[npm-url]: https://npmjs.com/package/hypermdx
[cov-badge-url]: https://img.shields.io/coveralls/github/talentlessguy/hypermdx?style=flat-square&color=%234AB8F2
[cov-url]: https://coveralls.io/github/talentlessguy/hypermdx
