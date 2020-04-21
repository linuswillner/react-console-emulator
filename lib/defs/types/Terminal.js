import PropTypes from 'prop-types'

const styleTypes = {
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  inputAreaStyle: PropTypes.object,
  promptLabelStyle: PropTypes.object,
  inputStyle: PropTypes.object
}

const classNameTypes = {
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  inputAreaClassName: PropTypes.string,
  promptLabelClassName: PropTypes.string,
  inputClassName: PropTypes.string
}

const optionTypes = {
  autoFocus: PropTypes.bool,
  dangerMode: PropTypes.bool,
  disableOnProcess: PropTypes.bool,
  noDefaults: PropTypes.bool,
  noEchoBack: PropTypes.bool,
  noHistory: PropTypes.bool,
  noAutoScroll: PropTypes.bool,
  noNewlineParsing: PropTypes.bool,
}

const labelTypes = {
  welcomeMessage: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.string
  ]),
  promptLabel: PropTypes.node,
  errorText: PropTypes.string
}

const commandTypes = {
  commands: PropTypes.object.isRequired,
  commandCallback: PropTypes.func
}

const messageTypes = {
  messageStyle: PropTypes.object,
  messageClassName: PropTypes.string
}

export default {
  ...styleTypes,
  ...classNameTypes,
  ...optionTypes,
  ...labelTypes,
  ...commandTypes,
  ...messageTypes
}
