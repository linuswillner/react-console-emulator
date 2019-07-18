// Jest config for additional coverage testing
module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/components/Terminal.jsx'],
  coverageDirectory: './coverage/'
}
