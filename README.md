# react-console-emulator

![Demo GIF](https://i.linuswillner.me/7u4Cd2V.gif)

### [Live demo](https://linuswillner.me/react-console-emulator/)

A simple, powerful and highly customisable terminal emulator for React.

## Features

- Highly customisable: Add your own background image, change the colour of different terminal elements and more!
- Extensively emulates a Unix terminal with dutiful accuracy
- Easy and powerful command system: Execute code from your own application and send the results to the terminal output.
- High concurrency: Register multiple terminals on the same page easily and safely without risk of mixing up inputs.

## Usage

```jsx
import React from 'react'
import Terminal from 'react-console-emulator'

const commands = {
  echo: {
    description: 'Echo a passed string.',
    usage: 'echo <string>',
    fn: function () {
      return `${Array.from(arguments).join(' ')}`
    }
  }
}

export default class MyTerminal extends React.Component {
  render () {
    return (
      <Terminal
        commands={commands}
        welcomeMessage={'Welcome to the React terminal!'}
        promptLabel={'me@React:~$'}
      />
    )
  }
}
```

## Props

| Prop | Description | Type |
| ---- | ----------- | ---- |
| commands | Commands for the terminal. See [Command syntax](#command-syntax) for more information. | Object |
| commandCallback | Function to execute after each command. See [commandCallback](#commandcallback) for more information. | Function |
| welcomeMessage | Welcome message(s) to display in terminal. Set to `true` to enable the default welcome message, pass an array to send multiple separate messages, or omit to disable the welcome message entirely. | String/Array/Boolean |
| promptLabel | Custom prompt label displayed in front of the command input. Omit to enable the default label of `$`. | String |
| errorText | Custom error text displayed when an unknown command is run. Omit to enable the default message. The placeholder `[command]` in the error string provides the command name that was input. | String |
| background | Terminal background. Accepts any background that [CSS recognises](https://developer.mozilla.org/en-US/docs/Web/CSS/background). | String (Valid CSS) |
| backgroundSize | The [background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) CSS property for the terminal background. | String (Valid CSS) |
| autoFocus | Automatically focus the terminal on page load. | Boolean |
| dangerMode | Parse command responses as HTML. **Warning:** This may open your application to abuse. It is recommended that you employ anti-XSS methods to validate command responses when using this option. | Boolean |
| noDefaults | Do not register default commands. **Warning:** If you enable this, you must manually create all command or otherwise the terminal will be moot. | Boolean |
| noAutomaticStdout | Disable all automatic output. Useful if you need to rely on [manualPushToStdout()](#static-output). | Boolean |
| noHistory | Disable command history. | Boolean |
| noAutoScroll | Disable the behaviour where the terminal scrolls to the bottom after each command. | Boolean |
| textColor | The colour of the text in the terminal, minus the prompt label and input. | String (Valid CSS) |
| promptLabelColor | The colour of the prompt label. | String (Valid CSS) |
| promptTextColor | The colour of the text in the command input field. | String (Valid CSS) |
| className | The CSS class name of the root element. | String |
| contentClassName | The CSS class name of the terminal content container (Stdout + prompt + input). | String |
| inputAreaClassName | The CSS class name of the input area (Prompt + input). | String |
| promptLabelClassName | The CSS class name of the prompt label. | String |
| inputClassName | The CSS class name of the input element. | String |

## Method reference

### commandCallback

If passed as a prop, the commandCallback function is executed each time a command completes execution. Returns an object with information about the command that was executed and the result thereof.

**Command result object reference**

| Property | Description | Type |
| -------- | ----------- | ---- |
| command | The command that was executed. | String |
| args | An array of the arguments that were passed to the command. | Array |
| rawInput | A string with the unprocessed input that was entered in the terminal. | String |
| result | The return value of the function executed in the command. | Any |

**Example:**
```jsx
commandCallback={result => console.log(result)}

/*
{
  command: 'help',
  args: [ 'test', 'test2' ]
  rawInput: 'help test test2',
  result: 'This is the help command.'
}
*/
```


## Command syntax

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
    explicitExec: true, // If your command outputs nothing to the terminal and you only need the function to be run, enable this
  }
}
```

## Async output

If you terminal deals with HTTP requests or cross-component functionality, you may need to wait for a result before pushing to the output.

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

The function of the `wait` command hooks into the terminal lifecycle (See [Terminal lifecycle](#terminal-lifecycle) for more on that) and pushes content to the output of the terminal after the command function has already terminated. This way, you can perform tasks elsewhere and push the output to the terminal when you get the result.

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
