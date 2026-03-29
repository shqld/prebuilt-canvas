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
  const platform = process.platform
  const arch = process.arch
  let key = `${platform}-${arch}`
  if (platform === 'linux') {
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
    // ldd --version exits non-zero on musl and prints to stderr
    return e.stderr ? e.stderr.includes('musl') : false
  }
}

function loadBinding () {
  const key = getPlatformKey()
  const packageName = PLATFORMS[key]

  if (packageName) {
    try {
      // Windows: DLLs are next to canvas.node, add to search path
      if (process.platform === 'win32') {
        const pkgDir = path.dirname(require.resolve(`${packageName}/package.json`))
        process.env.PATH = pkgDir + path.delimiter + process.env.PATH
      }
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
      `No prebuilt canvas binary found for ${key}. ` +
      `Supported platforms: ${supported}. ` +
      'To build from source: npm rebuild canvas --build-from-source'
    )
  }
}

const bindings = loadBinding()

module.exports = bindings

Object.defineProperty(bindings.Canvas.prototype, Symbol.toStringTag, {
  value: 'HTMLCanvasElement',
  configurable: true
})

Object.defineProperty(bindings.Image.prototype, Symbol.toStringTag, {
  value: 'HTMLImageElement',
  configurable: true
})

bindings.ImageData.prototype.toString = function () {
  return '[object ImageData]'
}

Object.defineProperty(bindings.ImageData.prototype, Symbol.toStringTag, {
  value: 'ImageData',
  configurable: true
})

bindings.CanvasGradient.prototype.toString = function () {
  return '[object CanvasGradient]'
}

Object.defineProperty(bindings.CanvasGradient.prototype, Symbol.toStringTag, {
  value: 'CanvasGradient',
  configurable: true
})

Object.defineProperty(bindings.CanvasPattern.prototype, Symbol.toStringTag, {
  value: 'CanvasPattern',
  configurable: true
})

Object.defineProperty(bindings.CanvasRenderingContext2d.prototype, Symbol.toStringTag, {
  value: 'CanvasRenderingContext2d',
  configurable: true
})
