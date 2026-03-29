'use strict'

// Smoke test: verifies each native library is linked and functional.
// Run with: node test/smoke.js

const assert = require('assert')
const path = require('path')

async function main () {
  const canvas = require('../index')

  // 1. Native library versions
  console.log('Cairo:', canvas.cairoVersion)
  console.log('Pango:', canvas.pangoVersion)
  console.log('FreeType:', canvas.freetypeVersion)
  console.log('JPEG:', canvas.jpegVersion)
  console.log('GIF:', canvas.gifVersion)
  console.log('RSVG:', canvas.rsvgVersion)

  assert(canvas.cairoVersion, 'Cairo version missing')
  assert(canvas.pangoVersion, 'Pango version missing')
  assert(canvas.freetypeVersion, 'FreeType version missing')

  // 2. Canvas creation + PNG output (Cairo + libpng)
  const c = canvas.createCanvas(200, 200)
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 200, 200)
  const png = c.toBuffer('image/png')
  assert(png.length > 0, 'PNG buffer is empty')
  assert(png[0] === 0x89, 'PNG magic byte mismatch')
  console.log('PNG output: OK (%d bytes)', png.length)

  // 3. JPEG output (libjpeg)
  if (canvas.jpegVersion) {
    const jpg = c.toBuffer('image/jpeg')
    assert(jpg.length > 0, 'JPEG buffer is empty')
    assert(jpg[0] === 0xFF && jpg[1] === 0xD8, 'JPEG magic mismatch')
    console.log('JPEG output: OK (%d bytes)', jpg.length)
  } else {
    console.log('JPEG output: SKIPPED (not compiled in)')
  }

  // 4. Text rendering (Pango + HarfBuzz + FreeType)
  ctx.font = '30px sans-serif'
  const metrics = ctx.measureText('Hello')
  assert(metrics.width > 0, 'measureText returned zero width')
  ctx.fillText('Hello', 10, 50)
  console.log('Text rendering: OK (width=%d)', metrics.width)

  // 5. Image loading (libpng)
  const testImage = path.join(__dirname, 'fixtures', 'checkers.png')
  const img = await canvas.loadImage(testImage)
  assert(img.width > 0, 'Image width is zero')
  ctx.drawImage(img, 0, 0)
  console.log('Image loading: OK (%dx%d)', img.width, img.height)

  // 6. PDF output (Cairo PDF backend)
  const pdfCanvas = canvas.createCanvas(200, 200, 'pdf')
  const pdfCtx = pdfCanvas.getContext('2d')
  pdfCtx.fillStyle = 'blue'
  pdfCtx.fillRect(0, 0, 100, 100)
  const pdf = pdfCanvas.toBuffer()
  assert(pdf.toString('ascii', 0, 5) === '%PDF-', 'PDF magic mismatch')
  console.log('PDF output: OK (%d bytes)', pdf.length)

  // 7. SVG output (Cairo SVG backend)
  const svgCanvas = canvas.createCanvas(200, 200, 'svg')
  const svgCtx = svgCanvas.getContext('2d')
  svgCtx.fillStyle = 'green'
  svgCtx.fillRect(0, 0, 100, 100)
  const svg = svgCanvas.toBuffer()
  assert(svg.toString().includes('<svg'), 'SVG output missing <svg> tag')
  console.log('SVG output: OK (%d bytes)', svg.length)

  // 8. registerFont (Pango + Fontconfig)
  const fontPath = path.join(__dirname, '..', 'examples', 'pfennigFont', 'Pfennig.ttf')
  try {
    canvas.registerFont(fontPath, { family: 'Pfennig' })
    const fontCanvas = canvas.createCanvas(200, 50)
    const fontCtx = fontCanvas.getContext('2d')
    fontCtx.font = '20px Pfennig'
    fontCtx.fillText('registerFont works', 10, 30)
    const fontMetrics = fontCtx.measureText('registerFont works')
    assert(fontMetrics.width > 0, 'registerFont measureText returned zero width')
    console.log('registerFont: OK (width=%d)', fontMetrics.width)
  } catch (err) {
    console.log('registerFont: FAILED -', err.message)
    throw err
  }

  console.log('\nAll smoke tests passed.')
}

main().catch(err => {
  console.error('Smoke test failed:', err)
  process.exit(1)
})
