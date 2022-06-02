export default (commands, commandName, matchCaseInsensitive) => {
  /* istanbul ignore next: Covered by interactivity tests */
  if (matchCaseInsensitive) {
    for (const command of Object.keys(commands)) {
      if (new RegExp(`^${commandName}$`, 'gi').test(command)) {
        return {
          exists: true,
          command
          // Have to return the defined and existing command name that matched here, otherwise the executor won't know which one it is
        }
      }
    }

    // Command not found
    return {
      exists: false,
      command: null
    }
  } else {
    return {
      exists: commandName in commands,
      command: commandName
    }
  }
}
