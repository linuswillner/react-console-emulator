import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Tile extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  }

  render () {
    return (
      <div className='tile'>
        <p>{this.props.title} [<a href={this.props.link}>Code</a>] </p>
        {this.props.children}
      </div>
    )
  }
}
