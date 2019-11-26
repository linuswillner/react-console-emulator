// react-console-emulator example app
import React from 'react'

import Terminal from '../lib/Terminal' // In your app, import from 'react-console-emulator'
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
  constructor (props) {
    super(props)
    this.terminal = React.createRef()
  }

  globalProps = {
    contentStyle: { fontFamily: '\'Inconsolata\', monospace' },
    inputStyle: { fontFamily: '\'Inconsolata\', monospace' }
  }

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

  manualPushCommands = {
    wait: {
      description: 'Waits 1000 ms and then pushes content to the output like any command.',
      fn: () => {
        const terminal = this.terminal.current
        setTimeout(() => terminal.pushToStdout('Tada! 1000 ms passed!'), 1000)
        return 'Running, please wait...'
      }
    }
  }

  render () {
    return (
      <div>
        <div className={'demo'}>
          <DemoTile>
            <Terminal
              {...this.globalProps}
              commands={this.commands}
            />
          </DemoTile>
          <DemoTile>
            <Terminal
              {...this.globalProps}
              commands={this.commands}
              welcomeMessage={true}
            />
          </DemoTile>
        </div>
        <div className={'demo'}>
          <DemoTile>
            <Terminal
              {...this.globalProps}
              commands={this.newDefaultCommands}
              welcomeMessage={[
                'This terminal is automatically focused on page load and has no default commands. It also has a custom error message.',
                'Commands entered in this terminal will get their results output to the console via the command callback.'
              ]}
              autoFocus={true}
              noDefaults={true}
              errorText={'I couldn\'t find a command called [command]!'} // The [command] placeholder is replaced at runtime with the input name
              commandCallback={commandResult => console.log('Command executed, result:', commandResult)}
            />
          </DemoTile>
          <DemoTile>
            <Terminal
              {...this.globalProps}
              commands={this.commands}
              welcomeMessage={[
                'The terminal is extensively customisable.',
                'You can set a custom background and change all of the colors in the terminal.',
                'You can even set a custom prompt label.'
              ]}
              style={{ background: 'url(\'https://i.linuswillner.me/FeTpWiB.jpg\')' }} // Terminal background
              contentStyle={{ color: '#FF8E00' }} // Text colour
              promptLabelStyle={{ color: '#FFFFFF' }} // Prompt label colour
              inputStyle={{ color: 'red' }} // Prompt text colour
              promptLabel={'admin@demo:~$'}
            />
          </DemoTile>
        </div>
        <div className={'demo'}>
          <DemoTile>
            <Terminal
              {...this.globalProps}
              ref={this.terminal}
              commands={this.manualPushCommands}
              welcomeMessage={'This terminal uses manual pushing, yet works as any normal terminal. Check the help command for more information.'}
            />
          </DemoTile>
          <DemoTile>
            <Terminal
              {...this.globalProps}
              commands={this.commands}
              welcomeMessage={[
                'The terminal keeps track of your commands (Unless disabled) and allows you to recall them.',
                'Try running some now and use the up and down arrow keys to navigate your history.'
              ]}
            />
          </DemoTile>
        </div>
      </div>
    )
  }
}
