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

  manualPushCommands = {
    safe: {
      fn: function () {
        const content = document.getElementsByName('react-console-emulator__content')[4]
        const input = document.getElementsByName('react-console-emulator__inputArea')[4]

        // By using Function.arguments, you can show correct commands in the terminal
        Terminal.manualPushToStdout(`$ safe${arguments ? ` ${Array.from(arguments).join(' ')}` : ''}`, content, input)
        Terminal.manualPushToStdout('This message was manually pushed to the terminal.', content, input)
      }
    },
    dangerous: {
      fn: function () {
        const content = document.getElementsByName('react-console-emulator__content')[4]
        const input = document.getElementsByName('react-console-emulator__inputArea')[4]

        // By using Function.arguments, you can show correct commands in the terminal
        Terminal.manualPushToStdout(`$ dangerous${arguments ? ` ${Array.from(arguments).join(' ')}` : ''}`, content, input)
        Terminal.manualPushToStdout('<div style="color: red;">This message was manually pushed the terminal with danger mode enabled.</div>', content, input, true)
      }
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
        <div className={'demo'}>
          <DemoTile>
            <Terminal
              commands={this.manualPushCommands}
              welcomeMessage={'This terminal has no automatic output and only uses manual pushing. Try the "safe" and "dangerous" commands.'}
              noDefaults={true}
              noAutomaticStdout={true} // Disables history as well
              errorText={'I couldn\'t find a command called [command]!'}
            />
          </DemoTile>
          <DemoTile>
            <Terminal
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
