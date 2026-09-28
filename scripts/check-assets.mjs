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
  } else {
    assert.ok(bytes.toString().includes(`viewBox="${item.viewBox}"`), `SVG bounds changed: ${item.path}`)
  }
}
console.log(`Verified ${registry.size} asset files in ${fileURLToPath(root)}`)
