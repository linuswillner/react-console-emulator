export default {
  commands: {
    echo: {
      description: 'Echo a passed string.',
      usage: 'echo <string>',
      fn: function () {
        return `${Array.from(arguments).join(' ')}`
      }
    },
    danger: {
      description: 'This command returns HTML. It will only work with terminals that have dangerous mode.',
      fn: () => 'I can<br/>use HTML in this<br/>and it will be parsed'
    }
  },
  casingCommands: {
    CaSeMatTeRs: {
      description: 'In terminals with case-insensitive matching, this command can be executed regardless of whether the casing is correct.',
      fn: () => 'This command is called "CaSeMatTeRs", but in case-insensitive terminals it can also be called with "casematters"!'
    }
  }
}
