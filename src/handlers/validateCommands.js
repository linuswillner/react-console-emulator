import commandExists from '../utils/commandExists'

/**
 * @param {Object} commands Command definitions
 * @param {Function} helpFn Function to display default help output
 * @param {Function} clearFn Function to clear the screen
 * @param {Object} options
 * @param {Object} options.noDefaults Whether to register default commands or not
 * @param {Object} options.ignoreCommandCase Whether to match command names case-insensitively or not
*/
export default (commands, helpFn, clearFn, options) => {
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
  if (!options.noDefaults) validCommands = { ...defaultCommands }
  else validCommands = {}

  for (const c in commands) {
    // If matching commands case-insensitively, ensure that command names are clean to avoid regex DoS
    // JS prop names don't allow weird characters unless quoted, but this is just a safety feature
    if (options.ignoreCommandCase && /[^a-zA-Z0-9-_]/gi.test(c)) {
      throw new Error(`Command name '${c}' is invalid; command names can only contain latin characters (A-Z), numbers (0-9) and dashes/underscores (- or _)`)
    }

    const { exists } = commandExists(validCommands, c, options.ignoreCommandCase)

    // Check that command does not already exist
    if (exists) {
      throw new Error(`Attempting to override existing command '${c}'; please only supply one definition of a certain command, or set the noDefaults property to enable overriding of existing commands`)
    }

    // Check that command contains a function
    if (typeof commands[c].fn !== 'function') {
      throw new Error(`'fn' property of command '${c}' is invalid; expected 'function', got '${typeof commands[c].fn}'`)
    }

    // Add description if missing
    if (!commands[c].description) commands[c].description = 'None'

    // Pass validation
    validCommands[c] = commands[c]
  }

  return validCommands
}
