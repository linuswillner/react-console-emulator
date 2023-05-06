import React, { Component } from 'react'
import html from 'react-inner-html'
import defaults from 'defaults'

import types from './defs/types/TerminalMessage'
import sourceStyles from './defs/styles/TerminalMessage'

import preserveSpaces from './utils/preserveSpaces'

export default class TerminalMessage extends Component {
  static propTypes = types

  render () {
    const { content, style, className, preserveSpacing } = this.props

    const styles = {
      message: defaults(style, sourceStyles)
    }

    content = preserveSpacing ? preserveSpaces(content) : content

    return this.props.dangerMode && typeof content === 'string'
      ? <div className={className} style={styles.message} {...html(content)}/>
      : <div className={className} style={styles.message}>{content}</div>
  }
}
