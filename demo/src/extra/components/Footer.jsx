import React, { Component } from 'react'
import Link from './Link'

export default class Footer extends Component {
  render () {
    return (
      <footer>
        <p><Link to='https://github.com/linuswillner/react-console-emulator'>react-console-emulator</Link> is a project by Linus Willner and Curtis Fowler.</p>
        <p>Copyright (c) 2018-{new Date().getFullYear()} the react-console-emulator authors.</p>
        <p>Licensed under the MIT license.</p>
      </footer>
    )
  }
}
