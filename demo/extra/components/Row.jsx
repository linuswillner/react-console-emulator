import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Row extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render () {
    return (
      <div className='row'>
        {this.props.children}
      </div>
    )
  }
}
