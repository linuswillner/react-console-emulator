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
      return `test ${lowerCaseArg1}`
    },
    explicitExec: true, // If you need to execute your function again after the output has been emitted, enable
  }
}
```

### Async output

If you terminal deals with HTTP requests or cross-component functionality, you may need to wait for a result before pushing to the output without relying on the function return time.

**Note:** Doing output this way is a workaround, and ideally your output should be returned by the command function. This method will expose functions to you that you do not normally have access to due to React component encapsulation. Proceed with caution.

To do this, you can use the [React refs API](https://reactjs.org/docs/refs-and-the-dom.html). Below is an example component that uses async pushing.

```jsx
import React from 'react'
import Terminal from 'react-console-emulator'

class MyTerminal extends React.Component {
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

- A key event triggers the [handleInput](src/components/Terminal.jsx#L242) function.
- The [handleInput](src/components/Terminal.jsx#L242) function behaves as follows:
  - If the either up or down arrow was pressed, [scrollHistory](src/components/Terminal.jsx#L200) is called with either `up` or `down` as a parameter, corresponding to the arrow key that was pressed.
  - If the Enter key was pressed, [processCommand](src/components/Terminal.jsx#L163) is called.
- Following the Enter path, if automatic output isn't disabled via the `noAutomaticStdout` prop, [pushToStdout](src/components/Terminal.jsx#L128) is called for the first time. This echoes the command that was entered into the terminal verbatim to mimic a UNIX terminal.
  - If history isn't disabled via the `noHistory` prop, the entered command is also stored in the history at this stage.
- If the input isn't empty, command processing begins.
  - If the command doesn't exist, an error message is pushed to the output. If a custom error text is set via the `errorText` prop, it takes precedence over the default one.
  - If the command exists, the command function is executed and the return value of that function is pushed to the terminal (Without storing the return value in history). If the `explicitExec` property on the command object is truthy, the function will explicitly execute a second time after the output being sent.
- The [clearInput](src/components/Terminal.jsx#L158) function is called.
- If automatic scrolling isn't disabled via the `noAutoScroll` prop, the terminal will scroll to the bottom of the output.
- If a command callback function is defined via the `commandCallback` prop, it is called at this stage.
