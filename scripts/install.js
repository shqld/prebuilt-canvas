'use strict'

const PLATFORMS = {
  'darwin-arm64': '@prebuilt-canvas/darwin-arm64',
  'darwin-x64': '@prebuilt-canvas/darwin-x64',
  'linux-arm64-gnu': '@prebuilt-canvas/linux-arm64-gnu',
  'linux-arm64-musl': '@prebuilt-canvas/linux-arm64-musl',
  'linux-x64-gnu': '@prebuilt-canvas/linux-x64-gnu',
  'linux-x64-musl': '@prebuilt-canvas/linux-x64-musl',
  'win32-x64': '@prebuilt-canvas/win32-x64'
}

let key = `${process.platform}-${process.arch}`
if (process.platform === 'linux') {
  try {
    require('child_process').execSync('ldd --version 2>&1')
    key += '-gnu'
  } catch (e) {
    key += (e.stderr && e.stderr.toString().includes('musl')) ? '-musl' : '-gnu'
  }
}

// Supported platform: check package exists, done
if (PLATFORMS[key]) {
  try {
    require.resolve(`${PLATFORMS[key]}/package.json`)
    process.exit(0)
  } catch (_) {
    // Platform package missing. Try explicit install (esbuild-style fallback)
    try {
      const version = require('../package.json').version
      require('child_process').execSync(
        `npm install ${PLATFORMS[key]}@${version}`,
        { stdio: 'inherit', cwd: require('path').resolve(__dirname, '..') }
      )
      process.exit(0)
    } catch (_) {}
  }
}

// Unsupported platform or platform package unavailable: node-gyp
try {
  require('child_process').execSync('node-gyp rebuild', {
    stdio: 'inherit',
    cwd: require('path').resolve(__dirname, '..')
  })
} catch (_) {
  console.error('Failed to build canvas from source.')
  console.error('Install system dependencies: https://github.com/Automattic/node-canvas#compiling')
  process.exit(1)
}
