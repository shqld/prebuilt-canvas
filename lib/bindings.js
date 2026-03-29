'use strict'

const path = require('path')

const PLATFORMS = {
  'darwin-arm64': '@prebuilt-canvas/darwin-arm64',
  'darwin-x64': '@prebuilt-canvas/darwin-x64',
  'linux-arm64-gnu': '@prebuilt-canvas/linux-arm64-gnu',
  'linux-arm64-musl': '@prebuilt-canvas/linux-arm64-musl',
  'linux-x64-gnu': '@prebuilt-canvas/linux-x64-gnu',
  'linux-x64-musl': '@prebuilt-canvas/linux-x64-musl',
  'win32-x64': '@prebuilt-canvas/win32-x64'
}

function getPlatformKey () {
  let key = `${process.platform}-${process.arch}`
  if (process.platform === 'linux') {
    key += isMuslLinux() ? '-musl' : '-gnu'
  }
  return key
}

function isMuslLinux () {
  try {
    const { execFileSync } = require('child_process')
    const output = execFileSync('ldd', ['--version'], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    return output.includes('musl')
  } catch (e) {
    return e.stderr ? e.stderr.includes('musl') : false
  }
}

function loadBinding () {
  const key = getPlatformKey()
  const packageName = PLATFORMS[key]
  const abi = process.versions.modules

  if (packageName) {
    try {
      const pkgDir = path.dirname(require.resolve(`${packageName}/package.json`))

      if (process.platform === 'win32') {
        process.env.PATH = pkgDir + path.delimiter + process.env.PATH
      }

      // Try ABI-specific binary first (v2/NAN builds)
      const abiBinary = path.join(pkgDir, `canvas-node-v${abi}.node`)
      try {
        return require(abiBinary)
      } catch (_) {}

      // Fall back to generic canvas.node (v3/N-API builds)
      return require(packageName)
    } catch (_) {
      // fall through to build-from-source fallback
    }
  }

  // Fallback: locally built binary
  try {
    const localPath = path.resolve(__dirname, '..', 'build', 'Release')
    if (process.platform === 'win32') {
      process.env.PATH = localPath + path.delimiter + process.env.PATH
    }
    return require(path.join(localPath, 'canvas.node'))
  } catch (_) {
    const supported = Object.keys(PLATFORMS).join(', ')
    throw new Error(
      `No prebuilt canvas binary found for ${key} (Node ABI ${abi}). ` +
      `Supported platforms: ${supported}. ` +
      'To build from source: npm rebuild canvas --build-from-source'
    )
  }
}

const bindings = loadBinding()

module.exports = bindings

bindings.ImageData.prototype.toString = function () {
  return '[object ImageData]'
}

bindings.CanvasGradient.prototype.toString = function () {
  return '[object CanvasGradient]'
}
