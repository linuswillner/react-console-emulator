import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Terminal from './components/Terminal'

const root = document.getElementById('root')

function render (Component) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  )
}

render(Terminal)

if (module.hot) {
  module.hot.accept('./components/Terminal', () => { render(Terminal) })
}
