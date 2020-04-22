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
      case 'up': {
        // Declaring variables for these here to better clarify this block which can get pretty convoluted
        const latest = commandHistory[0]
        const first = commandHistory[commandHistory.length - 1]
        const next = commandHistory[position + 1]

        if (position === null) {
          // If at no yet defined position, get most recent entry
          terminal.value = latest

          return {
            historyPosition: 0,
            previousHistoryPosition: null
          }
        } else if (position + 1 === commandHistory.length) {
          // If the first entry will be reached on this press, get it and decrement position by 1 to avoid confusing downscroll
          // EXCEPT: If there is only 1 unit in the history, our previous position was actually null, not zero as defined above
          // Hence why in one-unit histories the previous position has to be set to null, not 0
          terminal.value = first

          return {
            historyPosition: commandHistory.length - 1,
            previousHistoryPosition: commandHistory.length === 1 ? null : commandHistory.length - 2
          }
        } else {
          // Normal increment by one
          terminal.value = next

          return {
            historyPosition: position + 1,
            previousHistoryPosition: position
          }
        }
      }
      case 'down': {
        // Declaring variables for these here to better clarify this block which can get pretty convoluted
        const latest = commandHistory[0]
        const empty = ''
        const next = commandHistory[position - 1]

        if (position === null || !commandHistory[position]) {
          // If at initial or out of range, clear (Unix-like behaviour)
          terminal.value = empty

          return {
            historyPosition: null,
            previousHistoryPosition: null
          }
        } else if (position - 1 === -1) {
          // Clear because user is either pressing up once and is now pressing down again, or is reaching the latest entry
          if (previousPosition === null || (position === 0 && previousPosition === 1)) terminal.value = empty
          else terminal.value = latest

          return {
            historyPosition: null,
            previousHistoryPosition: null
          }
        } else {
          // Normal decrement by one
          terminal.value = next

          return {
            historyPosition: position - 1,
            previousHistoryPosition: position
          }
        }
      }
    }
  }
}
