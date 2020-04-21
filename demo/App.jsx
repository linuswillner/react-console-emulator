// react-console-emulator example app
import React, { Component } from 'react'

// Demo only
import './extra/demo.scss'
import config from './extra/config'
import Header from './extra/components/Header'
import Tile from './extra/components/Tile'
import Row from './extra/components/Row'
import Footer from './extra/components/Footer'

import Terminal from '../lib/Terminal' // In your app, import from 'react-console-emulator'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.terminal = React.createRef()
  }

  render () {
    const { globalProps, commands, newDefaultCommands, manualPushCommands } = config

    return (
      <main>
        <Header/>
        <Row>
          {/* Minimum viable terminal with autofocus on page load */}
          <Tile>
            <Terminal
              {...globalProps}
              commands={commands}
              autoFocus
            />
          </Tile>
          {/* Using the default welcome message */}
          <Tile>
            <Terminal
              {...globalProps}
              commands={commands}
              welcomeMessage
            />
          </Tile>
        </Row>
        <Row>
          {/* Using custom welcome message as an array, with default command overrides and custom error message + command callback */}
          <Tile>
            <Terminal
              {...globalProps}
              commands={newDefaultCommands}
              welcomeMessage={[
                'This terminal has no default commands and a custom error message when a command cannot be found.',
                'Commands entered in this terminal will get their results output to the console via the command callback. See it by pressing F12.'
              ]}
              noDefaults
              errorText={'I couldn\'t find a command called [command]!'} // The [command] placeholder is replaced at runtime with the input name
              commandCallback={commandResult => console.log('Command executed, result:', commandResult)}
            />
          </Tile>
          {/* Using custom styles on the terminal elements (Incl. restyling the background) and JSX as prompt label */}
          <Tile>
            <Terminal
              {...globalProps}
              commands={commands}
              welcomeMessage={[
                'The terminal is extensively customisable.',
                'You can set a custom background and change all of the colors in the terminal.',
                'You can even set a custom prompt label.'
              ]}
              style={{ background: 'url(\'https://storage.needpix.com/rsynced_images/abstract-wallpaper-1442844111BON.jpg\')' }} // Terminal BG
              contentStyle={{ color: '#FF8E00' }} // Text colour
              promptLabelStyle={{ color: '#FFFFFF' }} // Prompt label colour
              inputStyle={{ color: 'red' }} // Prompt text colour
              promptLabel={<b>root@React:~$</b>}
            />
          </Tile>
        </Row>
        <Row>
          {/* Using manual pushing with no echo back (Done via the manual push commands) and custom terminal message colours */}
          <Tile>
            <Terminal
              {...globalProps}
              ref={this.terminal}
              commands={manualPushCommands}
              messageStyle={{ color: 'red' }} // Message colour
              noEchoBack
              welcomeMessage={[
                'This terminal uses manual pushing, yet works as any normal terminal. Check the help command for more information.',
                'This terminal also has custom message styling.'
              ]}
            />
          </Tile>
          {/* History demo */}
          <Tile>
            <Terminal
              {...globalProps}
              commands={commands}
              welcomeMessage={[
                'The terminal also keeps track of your commands and allows you to recall them. Use the up and down arrow keys to navigate your history.'
              ]}
            />
          </Tile>
        </Row>
        <Row>
          {/* EOL parsing enabled */}
          <Tile>
            <Terminal
              {...globalProps}
              commands={commands}
              welcomeMessage={[
                'This terminal parses LF line breaks (\\\u200Bn).',
                'Try putting some line breaks in the echo command and see what happens!'
              ]}
            />
          </Tile>
          {/* EOL parsing disabled */}
          <Tile>
            <Terminal
              {...globalProps}
              commands={commands}
              welcomeMessage={[
                'This terminal does not parse line breaks.',
                'Try putting some line breaks in the echo command and see what happens!'
              ]}
              noNewlineParsing
            />
          </Tile>
        </Row>
        <Footer/>
      </main>
    )
  }
}
