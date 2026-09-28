export const TAPE_START = .04
export const TAPE_END = .96
const minimum = 91 ** 2
const capacity = 185 ** 2 - minimum

export function reelRadii(progress) {
  return {
    left: Math.sqrt(minimum + capacity * (1 - progress)),
    right: Math.sqrt(minimum + capacity * progress),
  }
}

export function initialMechanism(progress = .28) {
  return { progress: Math.max(TAPE_START, Math.min(TAPE_END, progress)), angles: { left: 0, right: 0 } }
}

export function advanceMechanism(previous, elapsed, transport, reducedMotion = false) {
  if (transport === 'stopped') return previous
  const direction = transport === 'rewinding' ? -3 : transport === 'forwarding' ? 3 : 1
  const progress = Math.max(TAPE_START, Math.min(TAPE_END, previous.progress + Math.min(elapsed, 50) * .000008 * direction))
  if (progress === previous.progress) return previous
  const before = reelRadii(previous.progress), after = reelRadii(progress)
  // Integrate each angular displacement independently as the pack radius changes.
  // Recomputing a accumulated angle times a changing ratio would introduce jumps.
  const angularScale = 2 * .045 * 150 / (.000008 * capacity)
  return { progress, angles: reducedMotion ? previous.angles : {
    left: previous.angles.left + (before.left - after.left) * angularScale,
    right: previous.angles.right + (after.right - before.right) * angularScale,
  } }
}
