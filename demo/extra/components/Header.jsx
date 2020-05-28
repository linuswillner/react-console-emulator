import React, { Component } from 'react'
import Link from './Link'

export default class Header extends Component {
  render () {
    return (
      <header>
        <h1><Link to='https://github.com/linuswillner/react-console-emulator'>react-console-emulator</Link></h1>
        <p>A simple, powerful and highly customisable Unix terminal emulator for React.</p>
        <p><Link to='https://npmjs.com/package/react-console-emulator'>View on NPM</Link> | <Link to='https://github.com/linuswillner/react-console-emulator'>View on Github</Link></p>
      </header>
    )
  }
}
