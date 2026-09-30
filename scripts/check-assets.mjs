import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { assets } from '../src/assets/index.js'

const root = new URL('../public/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('assets/manifest.json', root), 'utf8'))
const urls = object => Object.values(object).flatMap(value => typeof value === 'string' ? [value] : urls(value))
const registry = new Set(urls(assets))
assert.equal(registry.size, manifest.assets.length, 'Registry and manifest differ')
for (const item of manifest.assets) {
  assert.ok(registry.has(item.path), `Unregistered asset: ${item.path}`)
  const bytes = await readFile(new URL(item.path.slice(1), root))
  if (item.type === 'png') {
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG', `Invalid PNG: ${item.path}`)
    assert.equal(bytes.readUInt32BE(16), item.width, `Width changed: ${item.path}`)
    assert.equal(bytes.readUInt32BE(20), item.height, `Height changed: ${item.path}`)
  } else if (item.type === 'webp') {
    assert.ok(bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP', `Invalid WebP: ${item.path}`)
    const chunk = bytes.subarray(12, 16).toString()
    // VP8X stores the canvas size minus one in 24 bits; VP8L packs 14-bit sizes; plain VP8 keeps them after the key-frame tag.
    const [width, height] = chunk === 'VP8X' ? [bytes.readUIntLE(24, 3) + 1, bytes.readUIntLE(27, 3) + 1]
      : chunk === 'VP8L' ? [(bytes.readUInt32LE(21) & 0x3fff) + 1, ((bytes.readUInt32LE(21) >> 14) & 0x3fff) + 1]
      : [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff]
    assert.equal(width, item.width, `Width changed: ${item.path}`)
    assert.equal(height, item.height, `Height changed: ${item.path}`)
  } else {
    assert.ok(bytes.toString().includes(`viewBox="${item.viewBox}"`), `SVG bounds changed: ${item.path}`)
  }
}
console.log(`Verified ${registry.size} asset files in ${fileURLToPath(root)}`)
