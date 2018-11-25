/**
 * Workaround to clean an array from 'ghost items'.
 * @param {Array} dirtyArray
 */
function cleanArray (dirtyArray) {
  const newArray = Array.from(dirtyArray)
  return newArray.filter(i => i !== undefined)
}

export { cleanArray }
