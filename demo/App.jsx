// react-console-emulator example app
import React, { Component } from 'react'

// Demo only
import './extra/demo.scss'
import config from './extra/config'
import Header from './extra/components/Header'
import Row from './extra/components/Row'
import Tile from './extra/components/Tile'
import Footer from './extra/components/Footer'

import Terminal from '../src/Terminal' // In your app, import from 'react-console-emulator'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.terminal = React.createRef()
  }

  generateTerminalDemos = (terminals) => {
    const rows = []
    let rowAmount = 0

    while (terminals.length > 0) {
      // Row amount is just here to satisfy React
      rowAmount = ++rowAmount

      // Limit rows to 2 terminals for looks' sake
      rows.push(
        <Row key={rowAmount}>
          {
            terminals.splice(0, 2).map((terminal, i) => {
              return (
                <Tile key={i} title={terminal.title} link={terminal.link}>
                  {terminal.component}
                </Tile>
              )
            })
          }
        </Row>
      )
    }

    return rows
  }

  render () {
    const { globalStyles, commands, casingCommands } = config

    const terminals = [
      {
        title: 'Default terminal (With autoFocus enabled)',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L54-L55',
        component: <Terminal
          style={globalStyles}
          commands={commands}
          autoFocus
        />
      },
      {
        title: 'Default welcome message (With danger mode enabled)',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L63-L64',
        component: <Terminal
          style={globalStyles}
          commands={commands}
          welcomeMessage
          dangerMode
        />
      },
      {
        title: 'Custom welcome message as an array, overriding of default commands enabled, custom error message and command callback',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L71-L83',
        component: <Terminal
          style={globalStyles}
          commands={{
            help: {
              description: 'Custom help command.',
              fn: () => 'This help command was assigned with the help of noDefaults.'
            }
          }}
          welcomeMessage={[
            'This terminal has no default commands and a custom error message when a command cannot be found.',
            'Commands entered in this terminal will get their results output to the console via the command callback. See it by pressing F12.'
          ]}
          noDefaults
          errorText={'I couldn\'t find a command called [command]!'} // The [command] placeholder is replaced at runtime with the input command
          commandCallback={commandResult => console.log('Command executed, result:', commandResult)}
        />
      },
      {
        title: 'Custom styles on the terminal elements (Incl. restyling the background) and JSX as prompt label',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L90-L101',
        component: <Terminal
          commands={commands}
          welcomeMessage={[
            'The terminal is extensively customisable.',
            'You can set a custom background and change all of the colors in the terminal.',
            'You can even set a custom prompt label.'
          ]}
          // Remember to unset background-color before setting, as this can lead to styling bugs as per React
          style={{ backgroundColor: null, background: 'url(\'https://storage.needpix.com/rsynced_images/abstract-wallpaper-1442844111BON.jpg\')' }} // Terminal background
          contentStyle={{ color: '#FF8E00' }} // Text colour
          promptLabelStyle={{ color: '#FFFFFF' }} // Prompt label colour
          inputStyle={{ color: 'red' }} // Prompt text colour
          promptLabel={<b>root@React:~$</b>}
        />
      },
      {
        title: 'Manual pushing with no echo back (Due to manual pushing) and custom terminal message colours',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L108-L124',
        component: <Terminal
          style={globalStyles}
          ref={this.terminal}
          commands={{
            wait: {
              description: 'Waits 1000 ms and then pushes content to the output like any command.',
              fn: () => {
                const terminal = this.terminal.current
                setTimeout(() => terminal.pushToStdout('Tada! 1000 ms passed!'), 1000)
                return 'Running, please wait...'
              }
            }
          }}
          messageStyle={{ color: 'red' }} // Message colour
          noEchoBack
          welcomeMessage={[
            'This terminal uses manual pushing, yet works as any normal terminal. Check the help command for more information.',
            'This terminal also has custom message styling.'
          ]}
        />
      },
      {
        title: 'History demo',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L131-L132',
        component: <Terminal
          style={globalStyles}
          commands={commands}
          welcomeMessage='The terminal also keeps track of your commands and allows you to recall them. Use the up and down arrow keys to navigate your history.'
        />
      },
      {
        title: 'EOL parsing enabled',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L139-L144',
        component: <Terminal
          style={globalStyles}
          commands={commands}
          welcomeMessage={[
            // I have to use 0-width space here, because otherwise this will get parsed as a line break too :D
            'This terminal parses LF line breaks (\\\u200Bn).',
            'Try putting some line breaks in the echo command and see what happens!'
          ]}
        />
      },
      {
        title: 'EOL parsing disabled',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L151-L156',
        component: <Terminal
          style={globalStyles}
          commands={commands}
          welcomeMessage={[
            'This terminal does not parse line breaks.',
            'Try putting some line breaks in the echo command and see what happens!'
          ]}
          noNewlineParsing
        />
      },
      {
        title: 'Case sensitive command validation',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L163-L167',
        component: <Terminal
          style={globalStyles}
          commands={casingCommands}
          welcomeMessage={[
            'This terminal requires commands to be input in correct casing.',
            'Try running "help" and then running both "CaSeMatTeRs" and "casematters"!'
          ]}
        />
      },
      {
        title: 'Case insensitive command validation',
        link: 'https://github.com/linuswillner/react-console-emulator/blob/master/demo/App.jsx#L174-L179',
        component: <Terminal
          style={globalStyles}
          commands={casingCommands}
          welcomeMessage={[
            'This terminal does not require commands to be input in correct casing.',
            'Try running "help" and then running both "CaSeMatTeRs" and "casematters"!'
          ]}
          ignoreCommandCase
        />
      }
    ]

    return (
      <main>
        <Header/>
        {this.generateTerminalDemos(terminals)}
        <Footer/>
      </main>
    )
  }
}
