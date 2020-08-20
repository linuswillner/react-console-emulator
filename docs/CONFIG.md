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

### Options

The terminal has several options you can use to change the behaviour of it. All props in this section are optional.

| Prop | Description | Type | Default |
| ---- | ----------- | ---- | ------- |
| autoFocus | Focus the terminal on page load. | Boolean | `false` |
| dangerMode | Enable parsing of HTML in terminal messages. | Boolean | `false` |
| disabled | Whether to enable terminal input or not. | Boolean | `false` |
| disableOnProcess | Disable input to the terminal during command execution. | Boolean | `false` |
| errorText | The text to display when a command does not exist. Use the `[command]` placeholder for input substitution. | String | `'Command \'[command]\' not found!'` |
| hidePromptWhenDisabled | Hide entire prompt when input is manually disabled (Via the `disabled` prop) or when `disableOnProcess` is enabled and the terminal is processing. | Boolean | `false` |
| ignoreCommandCase | Disable case-sensitive matching of command inputs. **Note:** Enabling this feature results in a restriction of command names to alphanumeric characters, dashes and underscores, for security reasons. | Boolean | `false` |
| locked | Lock output to the current line. When this prop is set to `true`, all output to the terminal will only replace the latest line. This could be useful if you want to make something akin to a progress bar and update the latest line. | Boolean | `false` |
| noAutoScroll | Disable automatic scrolling to the bottom of the terminal when a command is executed (*nix-like). | Boolean | `false` |
| noDefaults | Do not register the default commands (`help` and `clear`). Useful if you want to override the functionality of either. | Boolean | `false` |
| noEchoBack | Disable command echoes (Terminal outputs of any commands entered). | Boolean | `false` |
| noHistory | Disable the storing and scrolling of history of the commands entered in the terminal. | Boolean | `false` |
| noNewlineParsing | Disable the parsing line breaks (\n) in command outputs as separate message, leave them unchanged. | Boolean | `false` |
| promptLabel | The prefix to use for the input field. Can be either string or element. | Node | `$` |
| readOnly | Hides the entire prompt, thus setting the terminal to read-only mode. | Boolean | `false` |
| styleEchoBack | Inherit style for command echoes (Terminal outputs of any commands entered) from prompt (Fully or partially, i.e. label or text only), or style them as regular messages. Omitting this prop enables default behaviour. | String<'labelOnly'/'textOnly'/'fullInherit'/'messageInherit'\> | `undefined` |
| welcomeMessage | The terminal welcome message. Set to `false` to disable, `true` to show the default, or supply a string (Or an array of them) to set a custom one. | Boolean/String/Array<String\> | `false` |

### Re-styling

To re-style the terminal, you have two options: [Inline styles](https://reactjs.org/docs/dom-elements.html#style) or supplying a class name. The former is recommended due to it automatically overriding the previous property without having to faff about with `!important` and similar hacks.

The default styles for the terminal can be found in [src/defs/styles/Terminal.js](../src/defs/styles/Terminal.js). The definitions contained within can be adjusted by submitting style overrides or class names to the following props.

All props in this section are optional.

| Prop | Target |
| ---- | ------ |
| style / className | Terminal root container. |
| contentStyle / contentClassName | Terminal content container. |
| inputAreaStyle / inputAreaClassName | Input area element (Container for prompt label and input field). |
| promptLabelStyle / promptLabelClassName | Prompt label (The prefix for the input). |
| inputStyle / inputClassName | Input field. **Note:** Applying styles for the text here may cause unexpected results, see below. |
| inputTextStyle / inputTextClassName | Input field text. |
| messageStyle / messageClassName | Terminal messages (Incl. command echoes if enabled via the `styleEchoBack` prop). |

**Note about input text styling:**

As of v5.0.0, input text styling has been moved to `inputTextStyle` and `inputTextClassName`. The reason for this is the introduction of prompt styling persistence for echoes in the same version. Despite the input text being part of the input element strictly speaking, **do not apply text styles in `inputStyle` or `inputClassName`, or you may see unexpected styling errors.**

Examples on how to override the terminal styles can be found in [src/App.jsx](../src/App.jsx).
