const buildMenuDialogStyle = theme => ({
  root: {
    color: '#dadada'
  },
  title: {
    width: '75%',
    wordWrap: 'break-word'
  },
  textField: {
    width: '100%'
  },
  content: {
    fontSize: '0.7em',
    lineHeight: '40px',
    color: '#dadada',
    '@media screen and (min-width: 405px)': {
      fontSize: '0.75em'
    },
    '@media screen and (min-width: 550px)': {
      fontSize: '1em'
    }
  },
  actions: {
    marginRight: '0px'
  },
  cssLabel: {
    color: '#b9bbbd !important'
  },
  cssOutlinedInput: {
    color: '#dadada',
    transition: '0.2s ease',
    backgroundColor: '#484b51',
    border: '1px solid #2a2c31',
    borderRadius: 5,
    '&:hover': {
      backgroundColor: '#3c3e44',
      transition: '0.2s ease'
    }
  },
  cssFocused: {
    borderColor: '#2a2c31',
    backgroundColor: '#3c3e44',
    transition: '0.2s ease'
  },
  underline: {
    '&:after': {
      borderBottom: '1px solid #2196f3'
    }
  }
});

export default buildMenuDialogStyle;
