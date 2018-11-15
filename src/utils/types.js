import PropTypes from 'prop-types'

export const types = {
  background: PropTypes.string,
  backgroundSize: PropTypes.string,
  textColor: PropTypes.string,
  promptLabelColor: PropTypes.string,
  promptTextColor: PropTypes.string,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  inputAreaClassName: PropTypes.string,
  promptLabelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  autoFocus: PropTypes.bool,
  dangerMode: PropTypes.bool,
  noDefaults: PropTypes.bool,
  noAutomaticStdout: PropTypes.bool,
  noHistory: PropTypes.bool,
  noAutoScroll: PropTypes.bool,
  welcomeMessage: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.string
  ]),
  promptLabel: PropTypes.string,
  errorText: PropTypes.string,
  commands: PropTypes.object.isRequired
}
