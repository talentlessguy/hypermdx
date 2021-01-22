import { jsx } from '@hyperlight/jsx'
import HelloWorld from '../components/HelloWorld'

export default ({ Page }) => Page

export const getServerSideState = async () => {
  const { Module } = await import('module')

  const require = Module.createRequire(import.meta.url)

  const { hypermdx } = await require('hypermdx')

  const md = hypermdx()

  return {
    state: {
      Page: md`
# hi


${(<HelloWorld />)}

- this is a list

page
      `
    }
  }
}
