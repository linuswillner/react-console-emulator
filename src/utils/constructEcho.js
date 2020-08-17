import React from 'react'
import defaults from 'defaults'
import terminalSourceStyles from '../defs/styles/Terminal'
import messageSourceStyles from '../defs/styles/TerminalMessage'

/**
 * Constructs command echo based on user's styling options
 * @param promptLabel - Prompt label element
 * @param rawInput - Raw command input
 * @param stylingProps - {
 *  styleEchoBack: string
 *  promptLabelClassName: string,
 *  promptLabelStyle: object,
 *  inputTextClassName: string,
 *  inputTextStyle: object
 * }
 */
export default (promptLabel, rawInput, stylingProps) => {
  const sources = {
    echo: {
      label: {
        className: stylingProps.promptLabelClassName,
        style: defaults(stylingProps.promptLabelStyle, terminalSourceStyles.promptLabel)
      },
      text: {
        className: stylingProps.inputTextClassName,
        style: defaults(stylingProps.inputTextStyle, terminalSourceStyles.inputText)
      }
    },
    // Note: Not offering individual options for message styling as messages only have one uniform style for the entire element per the spec
    message: {
      label: {
        className: stylingProps.messageClassName,
        style: defaults(stylingProps.messageStyle, messageSourceStyles)
      },
      text: {
        className: stylingProps.messageClassName,
        style: defaults(stylingProps.messageStyle, messageSourceStyles)
      }
    }
  }

  // Getting these via an IIFE so I can use returns
  // This is because variable reassignment in switch statements gets really hairy really quick
  const styles = (() => {
    switch (stylingProps.styleEchoBack) {
      case 'inherit': return sources.echo
      case 'message': return sources.message
      case 'labelOnly': return {
        label: sources.echo.label,
        text: {}
      }
      case 'textOnly': return {
        label: {},
        text: sources.echo.text
      }
      default: return {
        label: {},
        text: {}
      }
    }
  })()

  return (
    <div>
      <span {...styles.label}>{promptLabel} </span>
      <span {...styles.text}>{rawInput}</span>
    </div>
  )
}
