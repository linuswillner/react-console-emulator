export default (state, props) => {
  const isNotReadOnly = !props.readOnly

  const shouldHideWhenDisabled = props.hidePromptWhenDisabled
  const shouldDisableOnProcess = props.disableOnProcess
  const isDisabled = props.disabled
  const isProcessing = state.processing

  // If prompt should be hidden when disabled...
  /* istanbul ignore if: Covered by interactivity tests */
  if (shouldHideWhenDisabled) {
    if (isDisabled) return false // ...hide on explicit prop-controlled disable...
    else if (shouldDisableOnProcess && isProcessing) return false // ...or when disabling on process is enabled and terminal is processing.
  }

  // If no above conditions were met, the read-only state controls whether the prompt should be visible or not
  return isNotReadOnly
}
