<img src=".github/logo.png" height="250px">

# react-console-emulator

![Version](https://img.shields.io/npm/v/react-console-emulator) ![License](https://img.shields.io/npm/l/react-console-emulator) ![NPM downloads](https://img.shields.io/npm/dw/react-console-emulator) ![NPM bundle size](https://img.shields.io/bundlephobia/min/react-console-emulator) ![CircleCI](https://img.shields.io/circleci/build/github/linuswillner/react-console-emulator/master) ![Codecov](https://img.shields.io/codecov/c/github/linuswillner/react-console-emulator) 

A simple, powerful and highly customisable Unix terminal emulator for React.

[Live demo](https://linuswillner.me/react-console-emulator/)  
[Configuration guide](docs/CONFIG.md)  
[Command API](docs/API.md)

## Features

- Highly customisable: Add custom responses, restyle and tweak the terminal to your liking and much more.
- A Unix terminal in the browser: Accurately emulate a native Unix terminal in the browser with no setup required.
- Familiar shortcuts: The terminal can keep track of commands and allows the user to recall them at their behest.
- Easy and powerful command system: Execute code from your own application and send the results to the terminal output.
- Async output support: Push output to the terminal at any time, even after a command response has been emitted.
- Unlimited concurrency: Register as many terminals as you like with no risk of input confusion.

## Usage

> See more command examples in [demo/extra/config.js](demo/extra/config.js) and [demo/App.jsx](demo/App.jsx)

```jsx
import React, { Component } from 'react'
import Terminal from 'react-console-emulator'

const commands = {
  echo: {
    description: 'Echo a passed string.',
    usage: 'echo <string>',
    fn: (...args) => args.join(' ')
  }
}

export default class MyTerminal extends Component {
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

## Contributing

For information on contributing, see [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).

## License

MIT © Linus Willner and Curtis Fowler.  
"React" and any associated logos are trademarks of Facebook, Inc.
