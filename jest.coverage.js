// Jest config for additional coverage testing
module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/test/setupTests.js',
  collectCoverage: true,
  collectCoverageFrom: [ '<rootDir>/src/components/Terminal.jsx' ],
  coverageDirectory: './coverage/'
}
