export const sourceStyles = {
  container: {
    minWidth: '500x',
    minHeight: '300px',
    maxWidth: '100%', // Fill parent before overflowing
    maxHeight: '100%', // Fill parent before overflowing
    overflow: 'auto'
  },
  content: {
    padding: '20px',
    height: '100%',
  },
  inputArea: {
    display: 'inline-flex',
    width: '100%'
  },
  prompt: {

  },
  input: {
    border: '0',
    margin: '0',
    flexGrow: '100',
    width: '100%',
    background: 'transparent'
  }
}
