'use strict'

// Generates a platform-specific package.json for prebuild distribution.
// Usage: node prebuild/package-platform.js <platform-key> <output-dir>
// Example: node prebuild/package-platform.js linux-x64-gnu build/Release

const fs = require('fs')
const path = require('path')

const SCOPE = '@prebuilt-canvas'

const PLATFORM_CONFIGS = {
  'linux-x64-gnu': {
    os: ['linux'],
    cpu: ['x64'],
    libc: ['glibc'],
    files: ['canvas.node', '*.so*']
  },
  'linux-arm64-gnu': {
    os: ['linux'],
    cpu: ['arm64'],
    libc: ['glibc'],
    files: ['canvas.node', '*.so*']
  },
  'linux-x64-musl': {
    os: ['linux'],
    cpu: ['x64'],
    libc: ['musl'],
    files: ['canvas.node', '*.so*']
  },
  'linux-arm64-musl': {
    os: ['linux'],
    cpu: ['arm64'],
    libc: ['musl'],
    files: ['canvas.node', '*.so*']
  },
  'darwin-x64': {
    os: ['darwin'],
    cpu: ['x64'],
    files: ['canvas.node', '*.dylib']
  },
  'darwin-arm64': {
    os: ['darwin'],
    cpu: ['arm64'],
    files: ['canvas.node', '*.dylib']
  },
  'win32-x64': {
    os: ['win32'],
    cpu: ['x64'],
    files: ['canvas.node', '*.dll']
  }
}

const platformKey = process.argv[2]
const outputDir = process.argv[3]

if (!platformKey || !outputDir) {
  console.error('Usage: node prebuild/package-platform.js <platform-key> <output-dir>')
  console.error('Platform keys:', Object.keys(PLATFORM_CONFIGS).join(', '))
  process.exit(1)
}

const config = PLATFORM_CONFIGS[platformKey]
if (!config) {
  console.error(`Unknown platform key: ${platformKey}`)
  console.error('Valid keys:', Object.keys(PLATFORM_CONFIGS).join(', '))
  process.exit(1)
}

const rootPkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf8'))

const pkg = {
  name: `${SCOPE}/${platformKey}`,
  version: rootPkg.version,
  description: `node-canvas prebuilt binary for ${platformKey}`,
  license: rootPkg.license,
  repository: rootPkg.repository,
  os: config.os,
  cpu: config.cpu,
  main: 'canvas.node',
  files: config.files
}

if (config.libc) {
  pkg.libc = config.libc
}

const outputPath = path.resolve(outputDir, 'package.json')
fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(pkg, null, 2) + '\n')

console.log(`Generated ${outputPath} for ${pkg.name}@${pkg.version}`)
