export default {
  globalProps: {
    contentStyle: { fontFamily: '\'Inconsolata\', monospace' },
    inputStyle: { fontFamily: '\'Inconsolata\', monospace' }
  },
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
  newDefaultCommands: {
    help: {
      description: 'Custom help command.',
      fn: () => 'This help command was assigned with the help of noDefaults.'
    }
  },
  manualPushCommands: {
    wait: {
      description: 'Waits 1000 ms and then pushes content to the output like any command.',
      fn: () => {
        const terminal = this.terminal.current
        setTimeout(() => terminal.pushToStdout('Tada! 1000 ms passed!'), 1000)
        return 'Running, please wait...'
      }
    }
  },
  casingCommands: {
    CaSeMatTeRs: {
      description: 'In terminals with case-insensitive matching, this command can be executed regardless of whether the casing is correct.',
      fn: () => 'This command is called "CaSeMatTeRs", but in case-insensitive terminals it can also be called with "casematters"!'
    }
  }
}
