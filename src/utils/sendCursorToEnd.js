export default inputElement => {
  if (inputElement) {
    const cursorStart = inputElement.selectionStart
    const cursorEnd = inputElement.selectionEnd

    // Decouple execution for 2 ms (1 doesn't work for... Reasons) in order to properly send cursor to end
    setTimeout(() => inputElement.setSelectionRange(cursorStart, cursorEnd), 10)
  }
}
