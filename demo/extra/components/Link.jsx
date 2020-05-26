import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Footer extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  }

  render () {
    return (
      <a
        className='link'
        target='_blank'
        rel='noopener noreferrer'
        href={this.props.to}
      >
        {this.props.children}
      </a>
    )
  }
}
