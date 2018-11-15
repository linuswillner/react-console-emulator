function randstr () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let str = ''

  for (let i = 0; i < 15; i++) {
    str += chars.charAt(~~(Math.random() * chars.length))
  }

  return str
}

/**
 * Workaround to clean an array from 'ghost items'.
 * @param {Array} dirtyArray
 */
function cleanArray (dirtyArray) {
  const newArray = Array.from(dirtyArray)
  return newArray.filter(i => i !== undefined)
}

/**
 * Foolproofing function for cases where there are other elements with the same name.
 * @param {HTMLCollection} elements
 * @param {Function} filterCondition
 */
function filterNode (elements, filterCondition) {
  // Foolproofing in case there are other elements with the same name
  if (elements.length > 1) return Array.from(elements).filter(filterCondition)[0]
  else return elements[0]
}

export { randstr, cleanArray, filterNode }
