// Jest config for additional coverage testing
module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/defs', // Defs cannot be tested
    // These are covered by interactivity tests or other tests
    'cleanArray.js',
    'scrollHistory.js',
    'sendCursorToEnd.js'
  ],
  coverageDirectory: './coverage/'
}
