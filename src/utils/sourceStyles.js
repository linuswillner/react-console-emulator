export const sourceStyles = {
  container: {
    minWidth: '500x',
    minHeight: '300px',
    maxWidth: '100%', // Fill parent before overflowing
    maxHeight: '100%', // Fill parent before overflowing
    borderRadius: '5px',
    overflow: 'auto',
    cursor: 'text'
  },
  content: {
    padding: '20px',
    height: '100%',
    fontFamily: `'Inconsolata', monospace`,
    fontSize: '15px'
  },
  inputArea: {
    display: 'inline-flex',
    width: '100%'
  },
  prompt: {
    paddingTop: '3px'
  },
  input: {
    border: '0',
    padding: '0 0 0 7px',
    margin: '0',
    flexGrow: '100',
    width: '100%',
    height: '22px',
    background: 'transparent',
    fontFamily: `'Inconsolata', monospace`,
    fontSize: '15px'
  }
}
