module.exports = {
  server: {
    command: `cross-env NODE_ENV=development webpack-dev-server`,
    port: 8000,
    launchTimeout: 30000,
    debug: true,
    usedPortAction: 'ignore'
  }
}
