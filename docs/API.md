## Command creation API

### Command syntax

Commands are passed to the component in the following format. 
Each command must have a `fn` property. All other properties are optional.

```js
const commands = {
  commandName: {
    description: 'Optional description',
    usage: 'Optional usage instruction',
    fn: function (arg1, arg2) { // You may also use arrow functions
      // Arguments passed to the command will be passed to this function in the same order as they appeared in the terminal

      // You can execute custom code here
      const lowerCaseArg1 = arg1.toLowerCase()

      // What you return in this function will be output to the terminal
      // If you want to render non-string items, stringify them before outputting them here
      return `test ${lowerCaseArg1}`
    },
    explicitExec: true, // If you need to execute your function again after the output has been emitted, enable
  }
}
```

### Sync vs async command functions

Command functions (The `fn` property) can be sync or async. Asynchronous functions are awaited and their return values are displayed as those of a regular function would.

This is particularly useful if you have to make relatively low-latency operations like network requests and display their outputs. However, if your tasks are predicted to take longer than is feasible to wait for with a promise, see the [Async output](#async-output) section below.

### Updating terminal output

Akin to native terminals, the terminal output can at will be locked (Using the `locked` prop) to redirect all output to only replace the latest line, as opposed to pushing new lines. This can be utilised along with [Async output](#async-output) to, for example, create a continually incrementing progress bar.

**Note:** It might be worth setting the `locked` prop conditionally only when a command is run, if you do not want your welcome message to disappear, or get stripped down to only the last one if you're using a multi-message welcome, considering welcome messages behave exactly like ordinary user-triggered outputs.

### Async output

If your terminal commands need to perform tasks with significant delays (Wait for events, etc.) that cause promise resolution times to be prohibitively long, you may need to return a temporary value and then wait for a result before pushing to the output.

**Note:** Doing output this way is a workaround, and ideally your output should be returned by the command function. This method will expose functions to you that you do not normally have access to due to React component encapsulation. Proceed with caution.

To do this, you can use the [React refs API](https://reactjs.org/docs/refs-and-the-dom.html). Below is an example component that uses asynchronous output in this manner.

```jsx
import React, { Component } from 'react'
import Terminal from 'react-console-emulator'

class MyTerminal extends Component {
  constructor (props) {
    super(props)
    this.terminal = React.createRef()
  }

  // Experimental syntax, requires Babel with the transform-class-properties plugin
  // You may also define commands within render in case you don't have access to class field syntax
  commands = {
    wait: {
      description: 'Waits one second and sends a message.'
      fn: () => {
        const terminal = this.terminal.current
        setTimeout(() => terminal.pushToStdout('Hello after 1 second!'), 1500)
        return 'Running, please wait...'
      }
    }
  }

  render () {
    return (
      <Terminal
        ref={this.terminal} // Assign ref to the terminal here
        commands={commands}
      />
    )
  }
}
```

The function of the `wait` command hooks into the terminal lifecycle (See [Terminal lifecycle](#terminal-lifecycle)) and pushes content to the output of the terminal after the command function has already terminated. This way, you can perform tasks elsewhere and push the output to the terminal when you get the result.

The only notable caveat of this method is the breaking of component encapsulation. This is the trade-off for being able to push content on demand.

**Note:** Assigning a ref to the terminal component **exposes all of its functions and properties**. As such, you should take adequate measures against this being abused by end users and treat an exposed terminal with caution in general.

### Terminal lifecycle

Per standard, the terminal operates in the following way when a command is entered. You can hook into these processes when the terminal is exposed via the refs API.

- A key event triggers the [handleInput](../src/Terminal.jsx#L196) function.
- The [handleInput](../src/Terminal.jsx#L196) function behaves as follows:
  - If the either up or down arrow was pressed, [scrollHistory](../src/Terminal.jsx#L181) is called with either `up` or `down` as a parameter, corresponding to the arrow key that was pressed.
  - If the Enter key was pressed, [processCommand](../src/Terminal.jsx#L130) is called.
- Following the Enter path, if history isn't disabled via the `noHistory` prop, the entered command is also stored in the history at this stage via the [pushToHistory](../src/Terminal.jsx#L48) function.
  - If automatic output isn't disabled via the `noEchoBack` prop, [pushToStdout](../src/Terminal.jsx#L87) is called for the first time. This echoes the command that was entered into the terminal verbatim to mimic a UNIX terminal.
- If the input isn't empty, command processing begins.
  - The command existence is checked using the [commandExists](../src/utils/commandExists.js) function.
    - If the `ignoreCommandCase` prop is supplied, command existence is checked with a regular expression (I.e. case-insensitively). If not, command existence is checked by determining whether the `commands` object has a property named exactly as submitted from the input.
  - If the command doesn't exist, an error message is pushed to the output. If a custom error text is set via the `errorText` prop, it takes precedence over the default one.
  - If the command exists, the command function is executed and the return value of that function is pushed to the terminal (Without storing the return value in history). If the `explicitExec` property on the command object is truthy, the function will explicitly execute a second time after the output being sent.
- The [clearInput](../src/Terminal.jsx#L124) function is called.
- If automatic scrolling isn't disabled via the `noAutoScroll` prop, the terminal will scroll to the bottom of the output.
- If a command callback function is defined via the `commandCallback` prop, it is called at this stage.
