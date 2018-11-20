# 1.7.0

Internal refactoring for better maintainability.

Added default-enabled automatic scrolling to the bottom of the terminal when a command is run ([#36](https://github.com/js-rcon/react-console-emulator/issues/36)).

Added command callback support to run a function each time a command is executed ([#36](https://github.com/js-rcon/react-console-emulator/issues/36)).

Added `noAutoScroll` and `commandCallback` props.

# 1.6.0

Changed command change validation method from `JSON.stringify()` to use `stringify-object`. Object sources are now compared as opposed to the computed values, leading to better accuracy in re-validation.

# 1.5.1

Dependency updates and a README fix.

# 1.5.0

Fixed an issue where elements were getting mixed up with `manualPushToStdout`, leading to appending of content going wrong. 

The dangerMode property is now the second parameter for the function as opposed to the last.

# 1.4.1

Fixed terminal not automatically resuming focus when using `manualPushToStdout`.

# 1.4.0

Added command history support and manual stdout push support. Per default, the terminal will now store a history of entered commands which can be recalled using the up and down keys, similar to real CLI.

Added `noAutomaticStdout` and `noHistory` props.

Added `static manualPushToStdout` in order to push output manually to the terminal. This is a workaround for commands that perform things like network functions and have to wait for a response separately.

# 1.3.0

Added the ability to parse HTML in command responses. If dangerMode is enabled, command responses will be treated as HTML.

Added `dangerMode` and `noDefaults` props.

# 1.2.0

Added command validation after command prop update.

# 1.1.0

Added CSS class name support. Terminal components can now have custom class names passed as props.

Introduced `className`, `contentClassName`, `inputAreaClassName`, `promptLabelClassName` and `inputClassName` props.

# 1.0.2

Minor bug fixes.

# 1.0.1

Minor bug fixes.

# 1.0.0

Initial release.
