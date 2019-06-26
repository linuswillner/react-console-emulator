## Configuration

### Command callback

If passed a function, the `commandCallback` prop is executed each time a command completes execution. Returns an object with information about the command that was executed and the result thereof.

**Command result object reference**

| Property | Description | Type |
| -------- | ----------- | ---- |
| command | The command that was executed. | String |
| args | An array of the arguments that were passed to the command. | Array |
| rawInput | A string with the unprocessed input that was entered in the terminal. | String |
| result | The return value of the function executed in the command. | Any |

**Example:**
```jsx
commandCallback={result => console.log(result)}

/*
{
  command: 'help',
  args: [ 'test', 'test2' ]
  rawInput: 'help test test2',
  result: 'This is the help command.'
}
*/
```


### Changing labels

The different labels used by the terminal can be easily changed via the following props.

| Prop | Description | Type | Default |
| ---- | ----------- | ---- | ------- |
| welcomeMessage | The terminal welcome message. Set to `false` to disable, `true` to show the default, or supply a string (Or an array of them) to set a custom one. | Boolean/String/Array<String\> | `false` |
| promptLabel | The prefix to use for the input field. | String | `$` |
| errorText | The text to display when a command does not exist. Use the `[command]` placeholder for input substitution. | String | `Command '[command]' not found!` |

### Options

The terminal has several options you can use to change the behaviour of it.

| Prop | Description | Type | Default |
| ---- | ----------- | ---- | ------- |
| autoFocus | Focus the terminal on page load. | Boolean | `false` |
| dangerMode | Enable parsing of HTML in terminal messages. | Boolean | `false` |
| disableOnProcess | Disable input to the terminal during command execution. | Boolean | `false` |
| noDefaults | Do not register any default commands (`help` and `clear`). | Boolean | `false` |
| noAutomaticStdout | Disable *nix-like displaying of the entered command before the result of it. | Boolean | `false` |
| noHistory | Disable the storing and scrolling of history of the commands entered in the terminal. | Boolean | `false`
| noAutoScroll | Do not automatically scroll to the bottom of the terminal when a command is executed (*nix-like). | Boolean | `false`

### Re-styling

To re-style the terminal, you have two options: [Inline styles](https://reactjs.org/docs/dom-elements.html#style) or supplying a class name. The former is recommended due to it automatically overriding the previous property without having to faff about with `!important` and similar hacks.

The default styles for the terminal can be found in [src/defs/styles/Terminal.js](../src/defs/styles/Terminal.js). The definitions contained within can be adjusted by submitting style overrides or class names to the following props.

| Prop | Target |
| ---- | ------ |
| style / className | Terminal root container. |
| contentStyle / contentClassName | Terminal content container. |
| inputAreaStyle / inputAreaClassName | Input area element (Container for prompt label and input field). |
| promptLabelStyle / promptLabelClassName | Prompt label (The prefix for the input). |
| inputStyle / inputClassName | Text input field. |

Examples on how to override the terminal styles can be found in [src/App.jsx](../src/App.jsx).
