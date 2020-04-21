// Commands validator
export default (commands, helpFn, clearFn, noDefaults) => {
  const defaultCommands = {
    help: {
      description: 'Show a list of available commands.',
      fn: helpFn
    },
    clear: {
      description: 'Empty the terminal window.',
      explicitExec: true,
      fn: clearFn
    }
  }

  const immutables = Object.keys(defaultCommands)

  let validCommands

  // Pre-register defaults
  if (!noDefaults) validCommands = { ...defaultCommands }
  else validCommands = {}

  for (const c in commands) {
    // Check that command contains a function
    if (typeof commands[c].fn !== 'function') {
      throw new Error(`'fn' property of command '${c}' is invalid; expected 'function', got '${typeof commands[c].fn}'`)
    }

    // Check that the command does not attempt to override immutables
    if (!noDefaults && immutables.includes(c)) {
      throw new Error(`Cannot overwrite default command '${immutables[immutables.indexOf(c)]}'; set the noDefaults prop to true to enable overriding of default commands`)
    }

    // Add description if missing
    if (!commands[c].description) commands[c].description = 'None'

    // Pass validation
    validCommands[c] = commands[c]
  }

  return validCommands
}
