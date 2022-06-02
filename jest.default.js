// Default Jest config
module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  globals: {
    URL: 'http://localhost:3000'
  }
}
