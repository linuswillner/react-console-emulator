import innerText from 'react-innertext'

export default stdout => {
  const parsedStdout = []

  for (let i = 0; i < stdout.length; i++) {
    const currentLine = stdout[i]
    const { message, isEcho } = currentLine

    const messageText = innerText(message)

    // Do not parse echoes (Raw inputs)
    const parsed = !isEcho && /\n|\\n/g.test(messageText) ? messageText.split(/\n|\\n/g) : [message]

    for (const line of parsed) {
      parsedStdout.push({ message: line, isEcho: currentLine.isEcho })
    }
  }

  return parsedStdout
}
