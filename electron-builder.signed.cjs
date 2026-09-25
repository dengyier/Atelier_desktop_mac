const packageJson = require('./package.json')

module.exports = {
  ...packageJson.build,
  mac: {
    ...packageJson.build.mac,
    notarize: true
  },
  publish: null
}
