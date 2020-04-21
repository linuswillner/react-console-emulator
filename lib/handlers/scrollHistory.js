import cleanArray from '../utils/cleanArray'

/**
 * Scrolls command history in a given direction
 * @param {String} direction Direction to scroll in ('up' or 'down')
 * @param {Object} options
 * @param {Array} options.history - Array of previous inputs from the user
 * @param {Number} options.historyPosition - Current position in the history
 * @param {Number} options.previousHistoryPosition - Previous position in the history
 * @param {React.Ref} options.terminalInput - Ref to the terminal input element
 */
export default (direction, options) => {
  const { history, historyPosition, previousHistoryPosition, terminalInput } = options

  // Clean potential empty items and reverse order to ease position tracking
  // (Reverse = starting from the newest first when going up and vice versa)
  const commandHistory = cleanArray(history).reverse()
  const position = historyPosition
  const previousPosition = previousHistoryPosition
  const terminal = terminalInput.current

  if (commandHistory.length > 0) { // Only run if history is non-empty and in use
    switch (direction) {
      case 'up':
        if (position === null) {
          // If at no position, get most recent entry
          terminal.value = commandHistory[0]
          return { historyPosition: 0, previousHistoryPosition: null }
        } else if (position + 1 === commandHistory.length) {
          // If the first entry will be reached on this press, get it and decrement position by 1 to avoid confusing downscroll
          terminal.value = commandHistory[commandHistory.length - 1]
          return { historyPosition: commandHistory.length - 1, previousHistoryPosition: commandHistory.length - 2 }
        } else {
          // Normal increment by one
          terminal.value = commandHistory[position + 1]
          return { historyPosition: position + 1, previousHistoryPosition: position }
        }
      case 'down':
        if (position === null || !commandHistory[position]) {
          // If at initial or out of range, clear (Unix-like behaviour)
          terminal.value = ''
          return { historyPosition: null, previousHistoryPosition: null }
        } else if (position - 1 === -1) {
          // Clear because user pressed up once and is now pressing down again => clear or is reaching bottom
          if (previousPosition === null || (position === 0 && previousPosition === 1)) terminal.value = ''
          else terminal.value = commandHistory[0]

          return { historyPosition: null, previousHistoryPosition: null }
        } else {
          // Normal decrement by one
          terminal.value = commandHistory[position - 1]
          return { historyPosition: position - 1, previousHistoryPosition: position }
        }
    }
  }
}
