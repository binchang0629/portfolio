// The preview and commit use the same slot decision, including occupied-cell fallback.
export function storageSlot(storedSlots, caseSlots, id, preferredSlot) {
  const home = caseSlots.indexOf(id)
  const requested = preferredSlot ?? (home >= 0 ? home : undefined)
  const available = slot => storedSlots[slot] === null || storedSlots[slot] === id
  if (Number.isInteger(requested) && requested >= 0 && requested < storedSlots.length && available(requested)) return requested
  return storedSlots.findIndex((storedId) => storedId === null || storedId === id)
}
