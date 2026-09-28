import assert from 'node:assert/strict'
import { advanceMechanism, initialMechanism, reelRadii, TAPE_END, TAPE_START } from 'file:///C:/bin/portfolio/src/lib/tape-mechanism.js'

const start = initialMechanism(.28)
let state = start
const area = reelRadii(start.progress).left ** 2 + reelRadii(start.progress).right ** 2
for (let i = 0; i < 900; i++) {
  const before = state
  state = advanceMechanism(state, 16, 'forwarding')
  const radii = reelRadii(state.progress)
  assert.ok(Math.abs(radii.left ** 2 + radii.right ** 2 - area) < 1e-8, 'Winding area conserved')
  assert.ok(state.angles.left > before.angles.left && state.angles.right > before.angles.right, 'Both reels advance')
  assert.ok(state.angles.left - before.angles.left < 5 && state.angles.right - before.angles.right < 5, 'No angular jumps')
}
for (let i = 0; i < 900; i++) state = advanceMechanism(state, 16, 'rewinding')
assert.ok(Math.abs(state.progress - start.progress) < 1e-10, 'Winding reverses')
assert.ok(Math.abs(state.angles.left) < 1e-7 && Math.abs(state.angles.right) < 1e-7, 'Integrated rotations reverse')
assert.equal(advanceMechanism(start, 16, 'stopped'), start, 'Stop is stable')
assert.equal(advanceMechanism(initialMechanism(TAPE_END), 16, 'playing').progress, TAPE_END)
assert.equal(advanceMechanism(initialMechanism(TAPE_START), 16, 'rewinding').progress, TAPE_START)
const reduced = advanceMechanism(start, 16, 'playing', true)
assert.deepEqual(reduced.angles, start.angles, 'Reduced motion stops rotation')
assert.ok(reduced.progress > start.progress, 'Reduced motion preserves winding state')
process.stdout.write('Passed winding conservation, continuous independent rotations, reverse, stop, bounds and reduced-motion checks.\n')
