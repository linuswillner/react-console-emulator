/**
 * Returns a string where spacing is honored by html.
 * @param {string} stringOutput
 */
export default function renderSpaces(stringOutput) {
  return stringOutput.replace(/ /g, '\u00A0');
}
