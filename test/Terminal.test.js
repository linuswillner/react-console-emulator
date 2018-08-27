/* eslint-disable no-undef */

import React from 'react'
import { shallow, mount } from 'enzyme'
import puppeteer from 'puppeteer'

import Terminal from '../src/components/Terminal'

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
  }
}

let browser
let page

beforeAll(async () => {
  browser = await puppeteer.launch({})
  page = await browser.newPage()
  await page.coverage.startJSCoverage()
  await page.goto('http://localhost:8000')
})

afterAll(async () => {
  await page.coverage.stopJSCoverage()
  await browser.close()
})

describe('Terminal HTML structure', () => {
  it('Has required elements', () => {
    const wrapper = shallow(<Terminal commands={commands}/>)

    expect(wrapper.find('[name="react-console-emulator"]')).toHaveLength(1)
    expect(wrapper.find('[name="react-console-emulator__content"]')).toHaveLength(1)
    expect(wrapper.find('[name="react-console-emulator__inputArea"]')).toHaveLength(1)
    expect(wrapper.find('[name="react-console-emulator__input"]')).toHaveLength(1)
  })
})

describe('Terminal welcome messages', () => {
  it('Displays default welcome', () => {
    const wrapper = mount(<Terminal commands={commands} welcomeMessage={true}/>)
    const content = wrapper.find('[name="react-console-emulator__content"]')

    expect(content.childAt(0).text()).toBe('Welcome to the React terminal! Type \'help\' to get a list of commands.')

    wrapper.unmount()
  })

  it('Displays custom welcomes', () => {
    const wrapperSingle = mount(<Terminal commands={commands} welcomeMessage={'test'}/>)
    const wrapperMulti = mount(<Terminal commands={commands} welcomeMessage={['test', 'test2']}/>)

    const singleContent = wrapperSingle.find('[name="react-console-emulator__content"]')
    const multiContent = wrapperMulti.find('[name="react-console-emulator__content"]')

    // Renders single string correctly
    expect(singleContent.childAt(0).text()).toBe('test')

    // Renders array of strings correctly
    expect(multiContent.children('p')).toHaveLength(2)
    expect(multiContent.childAt(0).text()).toBe('test')
    expect(multiContent.childAt(1).text()).toBe('test2')

    wrapperSingle.unmount()
    wrapperMulti.unmount()
  })
})

describe('Terminal user interactivity', () => {
  // Helper functions for common testing functions

  async function enterCommand (command) {
    await page.click('[name="react-console-emulator"]')
    if (command) await page.keyboard.type(command)
    await page.keyboard.press('Enter', { delay: '10' })
  }

  async function getStdout () {
    const output = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('[name="react-console-emulator__content"]'))
      return elements[0].innerText.trim().replace(/\n/gi, '|')
    })

    return output
  }

  async function clearStdout () {
    await page.keyboard.type('clear')
    await page.keyboard.press('Enter', { delay: '10' })
  }

  it('Outputs blank on no input', async () => {
    await enterCommand()
    const output = await getStdout()

    expect(output).toBe('$||$')
    await clearStdout()
  })

  it('Outputs error on bad command', async () => {
    await enterCommand('doot')
    const output = await getStdout()

    expect(output.split('||')[1]).toBe('Command \'doot\' not found!')
    await clearStdout()
  })

  it('Outputs a command response correctly', async () => {
    await enterCommand('echo test')
    const output = await getStdout()

    expect(output.split('||')[1]).toBe('test')
    await clearStdout()
  })
})
