import React, { Component } from 'react'
import html from 'react-inner-html'

import types from './defs/types/TerminalMessage'
import sourceStyles from './defs/styles/TerminalMessage'

export default class TerminalMessage extends Component {
  static propTypes = types

  render () {
    const { content } = this.props

    const styles = {
      message: sourceStyles
    }

    return this.props.dangerMode
      ? <div style={styles.message} {...html(content)}/>
      : <div style={styles.message}>{content}</div>
  }
}
