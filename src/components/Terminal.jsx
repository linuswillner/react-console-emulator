import React from 'react'
import html from 'react-inner-html'
import stringifyObject from 'stringify-object'
import { sourceStyles } from '../utils/sourceStyles'
import { types } from '../utils/types'
import { cleanArray } from '../utils/helpers'

export default class Terminal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      commands: {},
      stdout: [],
      history: [],
      historyPosition: null
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

  static propTypes = {
    ...types
  }

  /**
   * Manually push to the stdout of a terminal. Use with caution.
   * @param {String} message The message to output to the terminal. If not using safe mode, make sure to XSS-proof this.
   * @param {Boolean} dangerMode If true, set output content with innerHTML. Dangerous.
   * @param {HTMLElement} contentElement The content element of the terminal you want to push output to. Uses first found element if omitted.
   * @param {HTMLElement} inputElement The input element of the terminal you want to push output to. Uses first found element if omitted.
   * @param {HTMLElement} inputAreaElement The input area element of the terminal you want to push output to. Uses first found element if omitted.
   */
  static manualPushToStdout (message, dangerMode, contentElement, inputElement, inputAreaElement) {
    const content = contentElement || document.getElementsByName('react-console-emulator__content')[0]
    const input = inputElement || document.getElementsByName('react-console-emulator__input')[0]
    const inputArea = inputAreaElement || document.getElementsByName('react-console-emulator__inputArea')[0]

    const messageElement = document.createElement('p')

    if (dangerMode) messageElement.innerHTML = message
    else messageElement.innerText = message

    messageElement.style = 'margin: 0px; line-height: 21px;'

    content.appendChild(messageElement)
    content.appendChild(inputArea)
    input.value = ''
    input.focus()
  }

  focusTerminal () {
    this.terminalInput.current.focus()
  }

  scrollToBottom () {
    const rootNode = this.terminalRoot.current

    // This may look ridiculous, but it is required to decouple execution for just a millisecond in order to scroll all the way
    setTimeout(() => { rootNode.scrollTop = rootNode.scrollHeight }, 1)
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
      if (typeof commands[c].fn !== 'function') throw new Error(`'fn' property of command '${c}' is invalid; expected 'function', got '${typeof commands[c].fn}'`)

      // Check that the command does not attempt to override immutables
      if (!this.props.noDefaults && immutables.includes(c)) throw new Error(`Attempting to overwrite default command '${immutables[immutables.indexOf(c)]}'; cannot override default commands`)

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

  pushToStdout (message, rawInput) {
    const stdout = this.state.stdout
    const history = this.state.history

    stdout.push(message)

    if (rawInput) {
      history.push(rawInput)
      this.setState({ stdout: stdout, history: history, historyPosition: null })
    } else this.setState({ stdout: stdout })
  }

  getStdout () {
    const lineStyle = {
      margin: '0',
      lineHeight: '21px'
    }

    return this.state.stdout.map((line, i) => {
      const safe = <p key={i} style={lineStyle}>{line}</p>
      const dangerous = <p key={i} style={lineStyle} {...html(line)}></p>

      return this.props.dangerMode ? dangerous : safe
    })
  }

  clearStdout () {
    this.setState({ stdout: [] })
  }

  clearInput () {
    this.setState({ historyPosition: null })
    this.terminalInput.current.value = ''
  }

  processCommand () {
    const commandResult = { command: null, args: [], rawInput: null, result: null }

    const rawInput = this.terminalInput.current.value

    const input = rawInput.split(' ')
    const command = input.splice(0, 1)[0] // Removed portion is returned...
    const args = input // ...and the rest can be used

    if (!this.props.noAutomaticStdout) {
      if (!this.props.noHistory) this.pushToStdout(`${this.props.promptLabel || '$'} ${rawInput}`, rawInput)
      else this.pushToStdout(`${this.props.promptLabel || '$'} ${rawInput}`)
    }

    if (rawInput) {
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

    this.clearInput()
    if (!this.props.noAutoScroll) this.scrollToBottom()
    if (this.props.commandCallback) this.props.commandCallback(commandResult)
  }

  scrollHistory (direction) {
    const history = cleanArray(this.state.history).reverse() // Clean empty items and reverse order to ease position tracking
    const position = this.state.historyPosition
    const termNode = this.terminalInput.current

    if (!this.state.noAutomaticStdout && history.length > 0) { // Only run if history is non-empty and in use
      switch (direction) {
        case 'up':
          if (position === null) { // If not touched, get most recent
            termNode.value = history[0]
            this.setState({ historyPosition: 0 })
          } else if (position + 1 === history.length) {
            // If the last item will be reached on this press, get first entry and decrement position by 1 to avoid confusing downscroll
            termNode.value = history[history.length - 1]
            this.setState({ historyPosition: history.length - 1 })
          } else {
            const atBottom = position - 1 === -1 // -1 for zero-based index

            // If at last item, increment by one more to avoid showing the same item twice
            termNode.value = atBottom ? history[position + 1] : history[position]
            this.setState({ historyPosition: atBottom ? position + 2 : position + 1 })
          }
          break
        case 'down':
          if (position === null || !history[position]) { // If at initial or out of range, clear (Unix-like behaviour)
            termNode.value = ''
            this.setState({ historyPosition: null })
          } else if (position - 1 === -1) {
            // If position will go negative on this press, bottom has been reached - reset
            termNode.value = history[0]
            this.setState({ historyPosition: null })
          } else {
            const reachedFirst = position + 1 === history.length // +1 for zero-based index

            // If at first item, decrement by one more to avoid showing the same item twice
            termNode.value = reachedFirst ? history[position - 1] : history[position]
            this.setState({ historyPosition: reachedFirst ? position - 2 : position - 1 })
          }
      }
    }
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
        ...sourceStyles.container,
        background: this.props.background || '#212121',
        backgroundSize: this.props.backgroundSize || 'cover'
      },
      content: {
        ...sourceStyles.content,
        color: this.props.textColor || '#FFFFFF'
      },
      inputArea: {
        ...sourceStyles.inputArea
      },
      prompt: {
        ...sourceStyles.prompt,
        color: this.props.promptLabelColor || '#EE9C34'
      },
      input: {
        ...sourceStyles.input,
        color: this.props.promptTextColor || '#F0BF81'
      }
    }

    return (
      <div
        ref={this.terminalRoot}
        className={this.props.className || null}
        name={'react-console-emulator'}
        style={styles.container}
        onClick={this.focusTerminal}
      >
        <div
          className={this.props.contentClassName || null}
          name={'react-console-emulator__content'}
          style={styles.content}
        >
          {this.getStdout()}
          <div
            className={this.props.inputAreaClassName || null}
            name={'react-console-emulator__inputArea'}
            style={styles.inputArea}
          >
            <span
              className={this.props.promptLabelClassName || null}
              style={styles.prompt}
            >
              {this.props.promptLabel || '$'}
            </span>
            <input
              ref={this.terminalInput}
              className={this.props.inputClassName || null}
              name={'react-console-emulator__input'}
              style={styles.input}
              type={'text'}
              onKeyDown={this.handleInput}
            />
          </div>
        </div>
      </div>
    )
  }
}
