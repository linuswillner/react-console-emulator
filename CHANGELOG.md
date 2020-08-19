# v5.0.0

This version brings with it some decently sized improvements to react-console-emulator.

### Breaking changes

The recommended method for terminal input text styling has been moved. Terminal input text should now be styled using the `inputTextStyle` and `inputTextClassName` props. **Note:** If using the newly-introduced styling persistence options for command echoes, leaving text styling in `inputStyle` or `inputClassName` may cause unexpected styling bugs.

The `styleEchoBack` prop no longer accepts boolean input. Instead, one should either omit it (For default behaviour) or define one of the string types detailed in the [options](docs/CONFIG.md#options).

### Main changes

Async command executor support is here! You can now use async functions as command handlers and their outputs will function identically to synchronous functions.

Added the ability to hide the prompt area entirely when the terminal is disabled either manually through the `disabled` prop or on process if `disableOnProcess` is enabled ([#639](https://github.com/linuswillner/react-console-emulator/issues/639)).

Added the ability to set the terminal to read-only mode with the `readOnly` prop, which disables input entirely and hides the prompt area ([#639](https://github.com/linuswillner/react-console-emulator/issues/639)).

### Other changes

Fixed a bug where newline parsing did not recognise newline literals properly ([#632](https://github.com/linuswillner/react-console-emulator/issues/632)).

Full run-down of prop changes:
```diff
+ inputTextStyle
+ inputTextClassName
+ hidePromptWhenDisabled
+ readOnly
```

# v4.0.1

Correct eslint-config-standard-react getting installed as a production dependency as opposed to a development one.

Reformatted changelog to look a bit better.

# v4.0.0

This update brings with it the biggest batch of changes to react-console-emulator since its initial release. Changes include a move to a new location, major restructurations of the repository and the internal logic, a whole bunch of changes, improvements, new features and of course some bug fixes.

### Breaking changes

Moved repositories; js-rcon/react-console-emulator is now linuswillner/react-console-emulator!

Renamed `noAutomaticStdout` prop to `noEchoBack` for added clarity.

### Main changes

Terminal message styling is here! You can now re-style the messages output by the terminal (Including echoes, optionally with the `styleEchoBack` prop) using the `messageStyle` and `messageClassName` props ([#518](https://github.com/linuswillner/react-console-emulator/issues/518)).

JSX prompt labels! Prompt labels now support elements instead of just plain old strings ([#210](https://github.com/linuswillner/react-console-emulator/issues/210)).

Newline parsing is now possible! The terminal can now parse newline characters in terminal messages - anything with a \n character in it will be rendered as a separate line in the response message. This does of course not apply to command back-echoes. This behaviour can also be disabled, if desired, using the `noNewlineParsing` prop ([#519](https://github.com/linuswillner/react-console-emulator/issues/519)).


Case-insensitive command matching! You can now supply the `ignoreCommandCase` prop to allow matching commands even when their casing is not correct. Do note that for security reasons, enabling case-insensitive command matching restricts command names to letters, numbers and dashes/underscores ([#415](https://github.com/linuswillner/react-console-emulator/issues/415)).

### Other changes

The acceptance of terminal input can now be controlled with a prop. Setting the `disabled` prop will enable/disable character input to the terminal.

Fixed an extremely long-running bug where, when the history only had one unit in it, the terminal would not correctly reset the input value and would show the same value twice. This has now finally been fixed after having been in the library for over two years.

Completely reworked demo page - the old one was really drab and plain, so I took the time to make it a lot more pretty and informative.

A full run-down of the prop changes is as follows:
```diff
- noAutomaticStdout
+ noEchoBack
+ noNewlineParsing
+ ignoreCommandCase
+ styleEchoBack
+ messageStyle
+ messageClassName
+ disabled
```

# v3.0.4

Fixed a bug preventing users from selecting text in the terminal output ([#414](https://github.com/linuswillner/react-console-emulator/issues/414)).

# v3.0.3

Removed redundant `stringify-object` dependency to properly enable command re-validation based on raw objects alone. This was supposed to have been fixed in 3.0.2, but due to a mishap the old validation was left dangling. This has now been fixed ([#411](https://github.com/linuswillner/react-console-emulator/issues/411)).

# v3.0.2

Fixed command re-validation reliability issues relating to source-identical commands ([#35](https://github.com/linuswillner/react-console-emulator/issues/35)).

# v3.0.1

Fixed input outline showing on Safari ([#258](https://github.com/linuswillner/react-console-emulator/pull/258)) ([Herve07h22](https://github.com/Herve07h22)).

# v3.0.0

### Breaking changes

`Terminal.manualPushToStdout()` has been removed. If you haven't already, now is the time to migrate to the new [async output method](docs/API.md#async-output).

The following style-related props have been removed and replaced:
```diff
- background
- backgroundSize
- textColor
- promptLabelColor
- promptTextColor
- contentFontFamily
- inputFontFamily
+ style
+ contentStyle
+ inputAreaStyle
+ promptLabelStyle
+ inputStyle
```

Instead of having a unique prop for styling only some parts of the terminal elements, every style aspect is now overridable. Any styles defines in [src/defs/styles/Terminal.js](src/defs/styles/Terminal.js) can be overridden via the new props. See [the guide](docs/CONFIG.md#re-styling) for more details.

### Other changes

Added better structured docs.

Added name to prompt label element for testing purposes.

Internal restructurations for better readability and maintainability.

# v2.0.0

### Breaking changes

Improved terminal instance tracking. Previously, the system relied on random strings and filtering DOM nodes to track which instance was the current one. Not only was this rather unsafe, it also introduced a risk of collisions.

This version removes the above behaviour and replaces it with the React refs API. As such, **this module now requires React 16.3 or above.** This is enforced by adding `react` and `react-dom` version 16.3.0 and up as peerDependencies.

In correlation with the introduction of refs, a new system will replace the similarly old and unsustainable `manualPushToStdout()` API. Documentation for the new system has been added to the README, while the old method docs have been moved to [LEGACY.md](LEGACY.md).

The above document also contains more information on the deprecation of `manualPushToStdout()`. The short version is that **manualPushToStdout is from this version onwards considered a deprecated legacy API that will eventually be removed.** A gradual deprecation scheme starts from this version with a warning emitted to the console when the function is used. See the legacy document for more information.

### Other changes

Fixed a multitude of bugs related to terminal history scrolling. In the past, items would get displayed twice when suddenly changing scrolling direction mid-travel. The terminal would also display out-of-range items (Manifesting as `undefined` entries in history). These bugs have now been fixed and the system has been made more robust overall.

Added the ability to disable input to the terminal during command processing. If enabled via the `disableOnProcess` prop, the terminal will be disabled while a command processing session is active.

Added the ability to supply custom font families to the terminal content and input via the `contentFontFamily` and `inputFontFamily` props.

# v1.7.3

Enabled module transpilation to widen the support amongst Node versions for distributed code. This allows the module to work even when Babel is not being used at the top level.

# v1.7.2

Re-added Babel into build flow in a different format to improve compatibility ([#39, comment](https://github.com/linuswillner/react-console-emulator/issues/39#issuecomment-440973765)).

# v1.7.1

Removed Babel from the build flow in order to allow the inclusion of the helper files ([#39](https://github.com/linuswillner/react-console-emulator/issues/39)).

# v1.7.0

Internal refactoring for better maintainability.

Added default-enabled automatic scrolling to the bottom of the terminal when a command is run ([#36](https://github.com/linuswillner/react-console-emulator/issues/36)).

Added command callback support to run a function each time a command is executed ([#36](https://github.com/linuswillner/react-console-emulator/issues/36)).

Added `noAutoScroll` and `commandCallback` props.

# v1.6.0

Changed command change validation method from `JSON.stringify()` to use `stringify-object`. Object sources are now compared as opposed to the computed values, leading to better accuracy in re-validation.

# v1.5.1

Dependency updates and a README fix.

# v1.5.0

Fixed an issue where elements were getting mixed up with `manualPushToStdout`, leading to appending of content going wrong. 

The dangerMode property is now the second parameter for the function as opposed to the last.

# v1.4.1

Fixed terminal not automatically resuming focus when using `manualPushToStdout`.

# v1.4.0

Added command history support and manual stdout push support. Per default, the terminal will now store a history of entered commands which can be recalled using the up and down keys, similar to real CLI.

Added `noAutomaticStdout` and `noHistory` props.

Added `static manualPushToStdout` in order to push output manually to the terminal. This is a workaround for commands that perform things like network functions and have to wait for a response separately.

# v1.3.0

Added the ability to parse HTML in command responses. If dangerMode is enabled, command responses will be treated as HTML.

Added `dangerMode` and `noDefaults` props.

# v1.2.0

Added command validation after command prop update.

# v1.1.0

Added CSS class name support. Terminal components can now have custom class names passed as props.

Introduced `className`, `contentClassName`, `inputAreaClassName`, `promptLabelClassName` and `inputClassName` props.

# v1.0.2

Minor bug fixes.

# v1.0.1

Minor bug fixes.

# v1.0.0

Initial release.
