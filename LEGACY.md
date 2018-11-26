## Why is manualPushToStdout deprecated?

Put simply, it was a badly engineered way to add content to the terminal asynchronously. As a method of adding content to a terminal, it was unsustainable, quirky and broke the component-based structure as it was called on an instance rather than on a component. It disabled large parts of the component's operation as well, hampering a very valid use case.

## What is going to happen to it?

Don't worry, the function is still available for now. This is the current roadmap for gradually phasing out the manualPushToStdout function.

- Version 2.0.0: Terminal.manualPushToStdout() will emit a deprecation warning upon use.
- Future 2.x.x release 1: Terminal.manualPushToStdout() will emit a deprecation error upon use and not push output to the terminal.
- Future 2.x.x release 2: Terminal.manualPushToStdout() is removed completely.

## What should I do?

You should migrate to the new method of asynchronous content pushing as soon as possible, since the old method may stop working at any time.

A much better way of asynchronously pushing content to the terminal was added in version 2.0.0, one that uses the React refs API and hooks into the normal terminal lifecycle. It allows you to take full advantage of the terminal functionality and still push content to it asynchronously. It's the old system with no compromises. What's not to like about that?

You can find out how to use the new method and associated documentation in the [Async output](README.md#async-output) section of the README.

## Legacy documentation

The documentation for the manualPushToStdout() function can be found below until the method is removed in an eventual future release.

### static manualPushToStdout (message, dangerMode, contentElement, inputElement, inputAreaElement)

This is a static function you can call on an instance of react-console-emulator. It allows you to manually push output to the terminal. This may be useful if you have async code that needs to push output even after the function has returned.

**Warning:** Using this function is not optimal and should be avoided if possible. If used, it is additionally recommended to set the **noAutomaticStdout** property to disable automatic output and command history (The latter of which will not work in this case).

**Parameter reference**

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| message | The message to push to the console. Can be HTML if **dangerMode** is set to true. | String |
| dangerMode | If set, set message content with innerHTML as opposed to innerText. It is highly recommended to XSS-proof the message if this setting is being used. | Boolean |
| contentElement | The content element to push output to. Uses the first element with the name **react-console-emulator__content** on the page if omitted. | HTMLElement |
| inputElement | The input element to clear after a command. Uses the first element with the name **react-console-emulator__input** on the page if omitted. | HTMLElement |
| inputAreaElement | The input area element to re-position after a command. Uses the first element with the name **react-console-emulator__inputArea** on the page if omitted. | HTMLElement |
