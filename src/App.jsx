// react-console-emulator example app
import React from 'react'

import Terminal from './components/Terminal' // In your app, import from 'react-console-emulator'
import './demo.scss' // Demo only

// Demo only
class DemoTile extends React.Component {
  render () {
    return (
      <div className={'terminal'}>
        {this.props.children}
      </div>
    )
  }
}

export default class App extends React.Component {
  commands = {
    echo: {
      description: 'Echo a passed string.',
      usage: 'echo <string>',
      fn: function () {
        return `${Array.from(arguments).join(' ')}`
      }
    },
    danger: {
      description: 'This command returns HTML. It will only work with terminals that have dangerous mode.',
      fn: () => 'I can<br/>use HTML in this<br/>and it will be parsed'
    }
  }

  newDefaultCommands = {
    help: {
      description: 'Custom help command.',
      fn: () => 'This help command was assigned with the help of noDefaults.'
    }
  }

  render () {
    return (
      <div>
        <div className={'demo'}>
          <DemoTile>
            <Terminal
              commands={this.commands}
              dangerMode={true}
            />
          </DemoTile>
          <DemoTile>
            <Terminal
              commands={this.commands}
              welcomeMessage={true}
            />
          </DemoTile>
        </div>
        <div className={'demo'}>
          <DemoTile>
            <Terminal
              commands={this.newDefaultCommands}
              welcomeMessage={'This terminal is automatically focused on page load and has no default commands. It also has a custom error message.'}
              autoFocus={true}
              noDefaults={true}
              errorText={'I couldn\'t find a command called [command]!'} // The [command] placeholder is replaced at runtime with the input name
            />
          </DemoTile>
          <DemoTile>
            <Terminal
              commands={this.commands}
              welcomeMessage={[
                'The terminal is extensively customisable.',
                'You can set a custom background and change all of the colors in the terminal.',
                'You can even set a custom prompt label.'
              ]}
              background={`url('https://i.linuswillner.me/FeTpWiB.jpg')`}
              textColor={'#FF8E00'}
              promptLabel={'admin@demo:~$'}
              promptLabelColor={'#FFFFFF'}
              promptTextColor={'red'}
            />
          </DemoTile>
        </div>
      </div>
    )
  }
}
