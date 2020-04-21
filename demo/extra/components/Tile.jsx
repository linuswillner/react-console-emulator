import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Tile extends Component {
  static propTypes = {
    children: PropTypes.any
  }

  render () {
    return (
      <div className='tile'>
        {this.props.children}
      </div>
    )
  }
}
