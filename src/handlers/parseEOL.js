import innerText from 'react-innertext'

const lineItemToString = (line) => {
  if (typeof line === 'object') {
    return JSON.stringify(line)
  } else {
    return `${line}`
  }
}

export default stdout => {
  const parsedStdout = []

  for (let i = 0; i < stdout.length; i++) {
    const currentLine = stdout[i]
    const { message, isEcho } = currentLine

    if (!isEcho && (typeof message !== 'string')) {
      parsedStdout.push({ message: lineItemToString(message), isEcho: false })
      continue
    }

    // Do not parse echoes (Raw inputs)
    const messageText = innerText(message)
    const parsed = !isEcho && /\\n/g.test(messageText) ? messageText.split(/\\n/g) : [messageText]
    for (const line of parsed) {
      parsedStdout.push({ message: line, isEcho: currentLine.isEcho })
    }
  }

  return parsedStdout
}
