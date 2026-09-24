const packageJson = require('./package.json')

module.exports = {
  ...packageJson.build,
  appId: 'space.artsmart.atelier.desktop.dev',
  productName: 'Atelier Desktop Dev',
  directories: {
    ...packageJson.build.directories,
    output: 'dist-dev'
  },
  extraMetadata: {
    name: 'atelier-desktop-dev',
    productName: 'Atelier Desktop Dev',
    dshDesktopChannel: 'development'
  },
  artifactName: 'atelier-desktop-dev-${os}-${arch}.${ext}',
  nsis: {
    ...packageJson.build.nsis,
    artifactName: 'atelier-desktop-dev-windows-${arch}-setup.${ext}'
  },
  publish: null
}
