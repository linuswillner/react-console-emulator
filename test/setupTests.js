import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'

const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' })
const { window } = jsdom

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js'
}

copyProps(window, global)

function copyProps (src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop)
    }), {})
  Object.defineProperties(target, props)
}

Enzyme.configure({ adapter: new Adapter() })
