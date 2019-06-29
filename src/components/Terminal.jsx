import React, { Component } from 'react'
import stringifyObject from 'stringify-object'
import defaults from 'defaults'

// Components
import TerminalMessage from './TerminalMessage'

// Handlers
import validateCommands from '../handlers/validateCommands'
import scrollHistory from '../handlers/scrollHistory'

// Definitions
import sourceStyles from '../defs/styles/Terminal'
import types from '../defs/types/Terminal'

export default class Terminal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      commands: {},
      stdout: [],
      history: [],
      historyPosition: null,
      previousHistoryPosition: null,
      processing: false
    }

    this.terminalRoot = React.createRef()
    this.terminalInput = React.createRef()

    this.focusTerminal = this.focusTerminal.bind(this)
    this.validateCommands = this.validateCommands.bind(this)
    this.showWelcomeMessage = this.showWelcomeMessage.bind(this)
    this.showHelp = this.showHelp.bind(this)
    this.pushToStdout = this.pushToStdout.bind(this)
    this.getStdout = this.getStdout.bind(this)
    this.clearStdout = this.clearStdout.bind(this)
    this.processCommand = this.processCommand.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  static propTypes = types

  focusTerminal () {
    this.terminalInput.current.focus()
  }

  scrollToBottom () {
    const rootNode = this.terminalRoot.current

    // This may look ridiculous, but it is necessary to decouple execution for just a millisecond in order to scroll all the way
    setTimeout(() => { rootNode.scrollTop = rootNode.scrollHeight }, 1)
  }

  validateCommands () {
    const validCommands = validateCommands(
      this.props.commands,
      this.showHelp,
      this.clearStdout,
      this.props.noDefaults
    )

    this.setState({ commands: validCommands })
  }

  showWelcomeMessage () {
    const msg = this.props.welcomeMessage

    if (typeof msg === 'boolean') this.pushToStdout(`Welcome to the React terminal! Type 'help' to get a list of commands.`)
    else if (Array.isArray(msg)) msg.map(item => this.pushToStdout(item))
    else this.pushToStdout(msg)
  }

  showHelp () {
    const { commands } = this.state

    for (let c in commands) {
      const cmdObj = commands[c]
      const usage = cmdObj.usage ? ` - ${cmdObj.usage}` : ''

      this.pushToStdout(`${c} - ${cmdObj.description}${usage}`)
    }
  }

  pushToStdout (message, rawInput) {
    const { stdout, history } = this.state

    stdout.push(message)

    if (rawInput) { // Only supplied if history is enabled
      history.push(rawInput)
      this.setState({ stdout: stdout, history: history, historyPosition: null })
    } else {
      this.setState({ stdout: stdout })
    }
  }

  getStdout () {
    return this.state.stdout.map((line, i) => <TerminalMessage key={i} content={line} />)
  }

  clearStdout () {
    this.setState({ stdout: [] })
  }

  clearInput () {
    this.setState({ historyPosition: null })
    this.terminalInput.current.value = ''
  }

  processCommand () {
    this.setState({ processing: true }, () => {
      // Initialise command result object
      const commandResult = { command: null, args: [], rawInput: null, result: null }
      const rawInput = this.terminalInput.current.value

      if (!this.props.noAutomaticStdout) {
        if (!this.props.noHistory) this.pushToStdout(`${this.props.promptLabel || '$'} ${rawInput}`, rawInput)
        else this.pushToStdout(`${this.props.promptLabel || '$'} ${rawInput}`)
      }

      if (rawInput) {
        const input = rawInput.split(' ')
        const command = input.splice(0, 1)[0] // Removed portion is returned...
        const args = input // ...and the rest can be used

        commandResult.rawInput = rawInput
        commandResult.command = command
        commandResult.args = args

        const cmdObj = this.state.commands[command]

        if (!cmdObj) this.pushToStdout(this.props.errorText ? this.props.errorText.replace(/\[command\]/gi, command) : `Command '${command}' not found!`)
        else {
          const res = cmdObj.fn(...args)

          this.pushToStdout(res)
          commandResult.result = res
          if (cmdObj.explicitExec) cmdObj.fn(...args)
        }
      }

      this.setState({ processing: false }, () => {
        this.clearInput()
        if (!this.props.noAutoScroll) this.scrollToBottom()
        if (this.props.commandCallback) this.props.commandCallback(commandResult)
      })
    })
  }

  scrollHistory (direction) {
    const toUpdate = scrollHistory(
      direction,
      this.state.history,
      this.state.historyPosition,
      this.state.previousHistoryPosition,
      this.terminalInput,
      this.props.noAutomaticStdout
    )

    this.setState(toUpdate)
  }

  handleInput (event) {
    switch (event.key) {
      case 'Enter': this.processCommand(); break
      case 'ArrowUp': this.scrollHistory('up'); break
      case 'ArrowDown': this.scrollHistory('down'); break
    }
  }

  componentDidUpdate (prevProps) {
    const oldCommands = stringifyObject(prevProps.commands)
    const currentCommands = stringifyObject(this.props.commands)

    // If there was a change in commands, re-validate
    if (oldCommands !== currentCommands) this.validateCommands()
  }

  componentDidMount () {
    this.validateCommands()
    if (this.props.welcomeMessage) this.showWelcomeMessage()
    if (this.props.autoFocus) this.focusTerminal()
  }

  render () {
    const styles = {
      container: defaults(this.props.style, sourceStyles.container),
      content: defaults(this.props.contentStyle, sourceStyles.content),
      inputArea: defaults(this.props.inputAreaStyle, sourceStyles.inputArea),
      promptLabel: defaults(this.props.promptLabelStyle, sourceStyles.promptLabel),
      input: defaults(this.props.inputStyle, sourceStyles.input),
    }

    return (
      <div
        ref={this.terminalRoot}
        name={'react-console-emulator'}
        className={this.props.className}
        style={styles.container}
        onClick={this.focusTerminal}
      >
        {/* Content */}
        <div
          name={'react-console-emulator__content'}
          className={this.props.contentClassName}
          style={styles.content}
        >
          {/* Stdout */}
          {this.getStdout()}
          {/* Input area */}
          <div
            name={'react-console-emulator__inputArea'}
            className={this.props.inputAreaClassName}
            style={styles.inputArea}
          >
            {/* Prompt label */}
            <span
              name={'react-console-emulator__promptLabel'}
              className={this.props.promptLabelClassName}
              style={styles.promptLabel}
            >
              {this.props.promptLabel || '$'}
            </span>
            {/* Input */}
            <input
              ref={this.terminalInput}
              name={'react-console-emulator__input'}
              className={this.props.inputClassName}
              style={styles.input}
              onKeyDown={this.handleInput}
              disabled={this.props.disableOnProcess && this.state.processing}
              type={'text'}
              autoComplete={'off'}
            />
          </div>
        </div>
      </div>
    )
  }
}
