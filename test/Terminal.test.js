/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Terminal from '../src/Terminal'

const commands = {
  echo: {
    description: 'Echo a passed string.',
    usage: 'echo <string>',
    fn: function () {
      return `${Array.from(arguments).join(' ')}`
    }
  },
  ping: {
    description: 'Tells you pong!',
    fn: () => 'Pong!'
  },
  danger: {
    fn: () => '<div style="color: red;>danger mode enabled</div>'
  }
}

const changedCommands = {
  changedEcho: {
    description: 'This was not here before.',
    usage: 'echo <string>',
    fn: function () {
      return `${Array.from(arguments).join(' ')}`
    }
  }
}

const newDefaultCommands = {
  help: {
    description: 'New help command',
    fn: () => 'This is a new help command'
  },
  validation: {
    description: 'This is to make sure this object registered',
    fn: () => 'valid'
  }
}

const evilNameCommands = {
  'te&st!': {
    fn: () => ''
  }
}

const duplicateCommands = {
  help: {
    fn: () => 'Help!'
  }
}

const invalidCommands = {
  noFn: {}
}

// This is horrible but it's apparently the official way of doing this https://stackoverflow.com/a/66329699
const neuterConsoleError = () => { console.error = () => {} }
const oldConsoleError = console.error

afterEach(() => {
  console.error = oldConsoleError
})

const getElement = name => document.querySelector(name ? `[name="react-console-emulator__${name}"]` : '[name="react-console-emulator"]')

const renderWithUser = component => ({
  user: userEvent.setup(),
  ...render(component)
})

describe('Terminal HTML structure', () => {
  it('Has required elements', () => {
    render(<Terminal commands={commands}/>)

    expect(getElement()).not.toBeNull()
    expect(getElement('content')).not.toBeNull()
    expect(getElement('inputArea')).not.toBeNull()
    expect(getElement('promptLabel')).not.toBeNull()
    expect(getElement('input')).not.toBeNull()
  })

  it('Hides the prompt in read-only mode', () => {
    render(<Terminal commands={commands} readOnly/>)
    expect(getElement('inputArea').style.display).toBe('none')
  })
})

describe('Terminal welcome messages', () => {
  it('Displays default welcome', () => {
    render(<Terminal commands={commands} welcomeMessage/>)
    expect(getElement('content').children[0].textContent).toBe('Welcome to the React terminal! Type \'help\' to get a list of commands.')
  })

  it('Displays a custom welcome message', () => {
    render(<Terminal commands={commands} welcomeMessage='test'/>)
    expect(getElement('content').children[0].textContent).toBe('test')
  })

  it('Displays multiple custom welcome messages', () => {
    render(<Terminal commands={commands} welcomeMessage={['test', 'test2']}/>)
    expect(getElement('content').children[0].textContent).toBe('test')
    expect(getElement('content').children[1].textContent).toBe('test2')
  })

  it('Renders HTML in welcome messages', () => {
    render(<Terminal commands={commands} welcomeMessage='<span color="red">test</span>' dangerMode/>)
    expect(getElement('content').children[0].outerHTML).toBe('<div style="line-height: 21px;"><span color="red">test</span></div>')
  })
})

describe('Terminal functionality', () => {
  it('Validates commands when they update', () => {
    const { user } = renderWithUser(<Terminal commands={commands} autoFocus/>)

    // TODO: Fix this
    user.click(getElement())
    user.keyboard('help')
    console.log(getElement('input').value)
    user.keyboard('[Enter]')

    expect(getElement('content').children).toBe('test')

    /*
    expect(wrapper.state().commands).toHaveProperty('echo')
    wrapper.setProps({ commands: changedCommands })
    expect(wrapper.state().commands).not.toHaveProperty('echo')
    expect(wrapper.state().commands).toHaveProperty('changedEcho')
    */
  })

  it('Registers new default commands', () => {
    const wrapper = render(<Terminal commands={newDefaultCommands} noDefaults/>)

    expect(wrapper.state().commands).toHaveProperty('validation')
    expect(wrapper.state().commands).toHaveProperty('help')

    wrapper.unmount()
  })

  it('Parses newlines (But not when disabled)', () => {
    const wrapperEnabled = render(<Terminal commands={commands} welcomeMessage={'split1\nsplit2'}/>)
    const wrapperDisabled = render(<Terminal commands={commands} welcomeMessage={'split1\nsplit2'} noNewlineParsing/>)

    const enabledContent = wrapperEnabled.find('[name="react-console-emulator__content"]')
    const disabledContent = wrapperDisabled.find('[name="react-console-emulator__content"]')

    // Splits with parsing enabled...
    expect(enabledContent.childAt(0).text()).toBe('split1')
    expect(enabledContent.childAt(1).text()).toBe('split2')

    // ...and doesn't with parsing disabled
    expect(disabledContent.childAt(0).text()).toBe('split1\nsplit2')

    wrapperEnabled.unmount()
    wrapperDisabled.unmount()
  })

  it('Only updates the last line when locked', () => {
    const wrapper = render(<Terminal commands={commands} welcomeMessage={['this is the first message', 'this is the second message']} locked/>)
    const content = wrapper.find('[name="react-console-emulator__content"]')

    expect(content.childAt(0).text()).toBe('this is the second message')

    wrapper.unmount()
  })
})

describe('Terminal command validator', () => {
  // TODO: Override console.error

  it('Throws an error when evil names are submitted to the regex', () => {
    neuterConsoleError()
    expect(() => render(<Terminal commands={evilNameCommands} ignoreCommandCase/>))
      .toThrowError(/Command name '\S+' is invalid; command names can only contain latin characters \(A-Z\), numbers \(0-9\) and dashes\/underscores \(- or _\)/)
  })

  it('Throws an error when default commands are being overriden without the noDefaults property being set', () => {
    neuterConsoleError()
    expect(() => render(<Terminal commands={duplicateCommands}/>))
      .toThrowError(/Attempting to override existing command '\S+'; please only supply one definition of a certain command, or set the noDefaults property to enable overriding of existing commands/)
  })

  it('Throws an error when commands with an invalid shape are submitted', () => {
    neuterConsoleError()
    expect(() => render(<Terminal commands={invalidCommands}/>))
      .toThrowError(/'fn' property of command '\S+' is invalid; expected 'function', got '\S+'/)
  })
})

/*
describe('Terminal user interactivity', () => {
  // Helper functions for common testing functions

  async function enterCommand (command) {
    await page.click('[name="react-console-emulator"]')
    if (command) await page.keyboard.type(command)
    await page.keyboard.press('Enter', { delay: '10' })
  }

  async function getStdout (whichTerminal) {
    const element = (await page.$$('[name="react-console-emulator__content"]'))[whichTerminal || 0]
    const rawOutput = await (await element.getProperty('innerText')).jsonValue()
    return rawOutput.trim().replace(/\n/gi, '|')
  }

  async function getInputValue (whichTerminal) {
    const element = (await page.$$('[name="react-console-emulator__input"]'))[whichTerminal || 0]
    const input = await (await element.getProperty('value')).jsonValue()
    return input
  }

  async function clearStdout () {
    await page.keyboard.type('clear')
    await page.keyboard.press('Enter', { delay: '10' })
  }

  it('Outputs blank on no input', async () => {
    await enterCommand()
    const output = await getStdout()

    expect(output).toBe('$|$')
    await clearStdout()
  })

  it('Outputs error on bad command', async () => {
    await enterCommand('doot')
    const output = await getStdout()

    expect(output.split('|')[1]).toBe('Command \'doot\' not found!')
    await clearStdout()
  })

  it('Outputs a command response correctly', async () => {
    await enterCommand('echo test')
    const output = await getStdout()

    expect(output.split('|')[1]).toBe('test')
    await clearStdout()
  })

  it('Outputs help', async () => {
    await enterCommand('help')
    const output = await getStdout()

    expect(output.split('|')[1]).toBe('help - Show a list of available commands.')
    await clearStdout()
  })

  it('Shows history and reacts appropriately', async () => {
    await enterCommand('echo test')
    await page.keyboard.press('ArrowUp')
    expect(await getInputValue()).toBe('echo test')
    await page.keyboard.press('ArrowDown')
    expect(await getInputValue()).toBe('')
  })
})
*/
