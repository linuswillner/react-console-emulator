module.exports = {
  launch: {
    headless: true,
    slowMo: 300
  },
  server: {
    command: 'cd demo && cross-env BROWSER=none npm start -- --open=false',
    port: 3000,
    launchTimeout: 30000,
    debug: true
  }
}
