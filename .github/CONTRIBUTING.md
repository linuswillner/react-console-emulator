### Thank you for displaying interest in contributing to react-console-emulator!

## Repository structure

- `demo`
  - The demo site at [linuswillner.me/react-console-emulator](https://linuswillner.me/react-console-emulator). Can be previewed with `npm start` and built with `npm run build`.
- `src`
  - Library code. All components related to how the library functions are located here.
- `test`
  - Unit tests, powered by Jest and Puppeteer.

## Contribution rules

You're free to implement changes that you believe will benefit the project in any manner, be it documentation improvements, code changes or something else. However, please consider the following before submitting a PR:

- Your code must...
  - Work as you intend it to
  - Pass style checks as outlined by ESLint (`npm run lint`)
  - Pass the unit tests and have such written if necessary (See the `test` folder, more below)
  - Be documented if relevant
  - Have a demo terminal written, if new terminal features are introduced

## Testing

Make sure the development dependencies are installed (`npm i`). Then run `npm run test-coverage` (For coverage) or `npm run test-nocoverage` (Without coverage) before you submit your PR. All tests must pass for the PR to be considered valid.

**Note:** It's not recommended to run `npm test` locally, as that step also includes Codecov report uploading, which will fail locally due to missing authentication information. If you want to accurately emulate CI test flow, use `npm run test-local` instead.

**Note about Puppeteer testing:** The jest-puppeteer toolchain [does not currently support collecting code coverage in a non-trivial way](https://github.com/smooth-code/jest-puppeteer/issues/90), so it's fine to set `/* istanbul ignore next: Covered by interactivity tests */` for any code that is covered by tests performed by Puppeteer until this changes.
