# react-console-emulator

[![Greenkeeper badge](https://badges.greenkeeper.io/js-rcon/react-console-emulator.svg)](https://greenkeeper.io/)

![Demo GIF](https://i.linuswillner.me/7u4Cd2V.gif)

A simple, powerful and highly customisable terminal emulator for React.

## Features

- Highly customisable: Add your own background image, change the colour of different terminal elements and more!
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
| welcomeMessage | Welcome message(s) to display in terminal. Set to `true` to enable the default welcome message, pass an array to send multiple separate messages, or omit to disable the welcome message entirely. | String/Array/Boolean |
| promptLabel | Custom prompt label displayed in front of the command input. Omit to enable the default label of `$`. | String |
| errorText | Custom error text displayed when an unknown command is run. Omit to enable the default message. The placeholder `[command]` in the error string provides the command name that was input | String |
| background | Terminal background. Accepts any background that [CSS recognises](https://developer.mozilla.org/en-US/docs/Web/CSS/background). | String (Valid CSS) |
| backgroundSize | The [background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) CSS property for the terminal background. | String (Valid CSS) |
| autoFocus | Automatically focus the terminal on page load. | Boolean |
| noDefaults | Do not register default commands. Warning: If you enable this, you must manually create all command or otherwise the terminal will be moot. | Boolean |
| textColor | The colour of the text in the terminal, minus the prompt label and input. | String (Valid CSS) |
| promptLabelColor | The colour of the prompt label. | String (Valid CSS) |
| promptTextColor | The colour of the text in the command input field. | String (Valid CSS) |
| className | The CSS class name of the root element. | String |
| contentClassName | The CSS class name of the terminal content container (Stdout + prompt + input). | String |
| inputAreaClassName | The CSS class name of the input area (Prompt + input). | String |
| promptLabelClassName | The CSS class name of the prompt label. | String |
| inputClassName | The CSS class name of the input element. | String |

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
