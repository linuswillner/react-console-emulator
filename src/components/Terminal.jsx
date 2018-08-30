import React from 'react'
import PropTypes from 'prop-types'

export default class Terminal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tracker: randstr(),
      commands: {},
      stdout: []
    }

    this._getTerminalNode = this._getTerminalNode.bind(this)
    this.focusTerminal = this.focusTerminal.bind(this)
    this.validateCommands = this.validateCommands.bind(this)
    this.showWelcomeMessage = this.showWelcomeMessage.bind(this)
    this.showHelp = this.showHelp.bind(this)
    this.pushToStdout = this.pushToStdout.bind(this)
    this.getStdout = this.getStdout.bind(this)
    this.clearStdout = this.clearStdout.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  _getTerminalNode () {
    const elements = document.getElementsByName('react-console-emulator__input')

    // Foolproofing in case there are other elements with the same name
    if (elements.length > 1) return Array.from(elements).filter(el => el.dataset.input === this.state.tracker)[0]
    else return elements[0]
  }

  focusTerminal () {
    this._getTerminalNode().focus()
  }

  validateCommands () {
    const immutables = ['help', 'clear']
    const commands = this.props.commands

    const defaultCommands = {
      help: {
        description: 'Show a list of available commands.',
        fn: this.showHelp
      },
      clear: {
        description: 'Empty the terminal window.',
        explicitExec: true,
        fn: this.clearStdout
      }
    }

    let validCommands

    // Pre-register defaults
    if (!this.props.noDefaults) validCommands = { ...defaultCommands }
    else validCommands = {}

    for (let c in commands) {
      // Check that command contains a function
      if (typeof commands[c].fn !== 'function') throw new Error(`'fn' property of command '${c}' is invalid; expected 'function', got '${typeof commands[c].name}'`)

      // Check that the command does not attempt to override immutables
      if (!this.props.noDefaults && immutables.includes(commands[c].name)) throw new Error(`Attempting to overwrite default command '${immutables[immutables.indexOf(commands[c].name)]}'; cannot override default commands`)

      // Add description if missing
      if (!commands[c].description) commands[c].description = 'None'
      validCommands[c] = commands[c]
    }

    this.setState({ commands: validCommands })
  }

  showWelcomeMessage () {
    const msg = this.props.welcomeMessage

    if (typeof msg === 'boolean') this.pushToStdout(`Welcome to the React terminal! Type 'help' to get a list of commands.`)
    else if (Array.isArray(msg)) msg.map(item => this.pushToStdout(item))
    else this.pushToStdout(msg)
  }

  showHelp () {
    for (let c in this.state.commands) {
      const cmdObj = this.state.commands[c]
      const usage = cmdObj.usage ? ` - ${cmdObj.usage}` : ''
      this.pushToStdout(`${c} - ${cmdObj.description}${usage}`)
    }
  }

  pushToStdout (message) {
    const stdout = this.state.stdout
    stdout.push(message)

    this.setState({ stdout: stdout })
  }

  getStdout () {
    const lineStyle = {
      margin: '0',
      lineHeight: '21px'
    }

    return this.state.stdout.map((line, i) => {
      return <p key={i} style={lineStyle}>{line}</p>
    })
  }

  clearStdout () {
    this.setState({ stdout: [] })
  }

  clearInput () {
    this._getTerminalNode().value = ''
  }

  handleInput (event) {
    if (event.key === 'Enter') {
      const rawInput = this._getTerminalNode().value

      const input = rawInput.split(' ')
      const command = input.splice(0, 1) // Removed portion is returned...
      const args = input // ...and the rest can be used

      this.pushToStdout(`${this.props.promptLabel || '$'} ${rawInput}`)

      if (rawInput) {
        const cmdObj = this.state.commands[command]

        if (!cmdObj) this.pushToStdout(this.props.errorText ? this.props.errorText.replace(/\[command\]/gi, command) : `Command '${command}' not found!`)
        else {
          this.pushToStdout(cmdObj.fn(...args))
          if (cmdObj.explicitExec) cmdObj.fn(...args)
        }
      }

      this.clearInput()
    }
  }

  componentDidUpdate (prevProps) {
    const oldCommands = JSON.stringify(prevProps.commands)
    const currentCommands = JSON.stringify(this.props.commands)

    // There was a change in commands
    if (oldCommands !== currentCommands) {
      // Re-validate
      this.validateCommands()
    }
  }

  componentDidMount () {
    this.validateCommands()
    if (this.props.welcomeMessage) this.showWelcomeMessage()
    if (this.props.autoFocus) this.focusTerminal()
  }

  render () {
    const styles = {
      container: {
        minWidth: '500x',
        minHeight: '300px',
        maxWidth: '100%', // Fill parent before overflowing
        maxHeight: '100%', // Fill parent before overflowing
        borderRadius: '5px',
        background: this.props.background || '#212121',
        backgroundSize: this.props.backgroundSize || 'cover',
        overflow: 'auto',
        cursor: 'text'
      },
      content: {
        padding: '20px',
        height: '100%',
        color: this.props.textColor || '#FFFFFF',
        fontFamily: `'Inconsolata', monospace`,
        fontSize: '15px'
      },
      inputArea: {
        display: 'inline-flex',
        width: '100%'
      },
      prompt: {
        paddingTop: '3px',
        color: this.props.promptLabelColor || '#EE9C34'
      },
      input: {
        border: '0',
        padding: '0 0 0 7px',
        margin: '0',
        flexGrow: '100',
        width: '100%',
        height: '22px',
        background: 'transparent',
        fontFamily: `'Inconsolata', monospace`,
        fontSize: '15px',
        color: this.props.promptTextColor || '#F0BF81'
      }
    }

    return (
      <div
        className={this.props.className || ''}
        name={'react-console-emulator'}
        style={styles.container}
        onClick={this.focusTerminal}
      >
        <div
          className={this.props.contentClassName || ''}
          name={'react-console-emulator__content'}
          style={styles.content}
        >
          {this.getStdout()}
          <div
            className={this.props.inputAreaClassName || ''}
            name={'react-console-emulator__inputArea'}
            style={styles.inputArea}
          >
            <span
              className={this.props.promptLabelClassName || ''}
              style={styles.prompt}
            >
              {this.props.promptLabel || '$'}
            </span>
            <input
              className={this.props.inputClassName || ''}
              name={'react-console-emulator__input'}
              data-input={this.state.tracker}
              style={styles.input}
              type={'text'}
              onKeyPress={this.handleInput}
            />
          </div>
        </div>
      </div>
    )
  }
}

Terminal.propTypes = {
  background: PropTypes.string,
  backgroundSize: PropTypes.string,
  textColor: PropTypes.string,
  promptLabelColor: PropTypes.string,
  promptTextColor: PropTypes.string,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  inputAreaClassName: PropTypes.string,
  promptLabelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  autoFocus: PropTypes.bool,
  noDefaults: PropTypes.bool,
  welcomeMessage: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.string
  ]),
  promptLabel: PropTypes.string,
  errorText: PropTypes.string,
  commands: PropTypes.object.isRequired
}

function randstr () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let str = ''

  for (let i = 0; i < 15; i++) {
    str += chars.charAt(~~(Math.random() * chars.length))
  }

  return str
}
