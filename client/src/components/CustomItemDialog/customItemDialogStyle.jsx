import checkBoxAndRadioStyle from '../../assets/jss/material-dashboard-react/checkboxAndRadioStyle';

const customItemDialogStyle = theme => ({
  ...checkBoxAndRadioStyle,
  root: {
    color: '#b9bbbd',
    '@media screen and (max-width: 550px)': {
      marginLeft: 2
    }
  },
  hidden: {
    visibility: 'hidden',
    marginBottom: 5
  },
  title: {
    width: '75%',
    wordWrap: 'break-word'
  },
  textField: {
    borderRadius: '5px',
    marginBottom: 5
  },
  itemMods: {
    '@media screen and (max-width: 550px)': {
      fontSize: '0.8em'
    },
    padding: 10,
    border: '1px solid #2a2c31',
    boxSizing: 'border-box',
    marginBottom: 20
  },
  itemMod: {
    display: 'flex',
    marginBottom: 2
  },
  itemModText: {
    flexBasis: '80%'
  },
  itemModTag: {
    flexBasis: '10%',
    width: '60px',
    textAlign: 'center',
    border: '1px solid #2a2c31',
    borderRadius: 3,
    marginRight: 5,
    padding: '0px 2px',
    fontSize: '0.87em',
    lineHeight: '20px',
    height: '20px'
  },
  iconButton: {
    marginTop: '-5px',
    padding: '5px',
    color: '#f44336',
    height: 34,
    width: 34
  },
  label: {
    color: '#b9bbbd',
    marginTop: 5
  },
  modLabel: {
    color: '#b9bbbd',
    marginTop: 10,
    fontSize: '0.8rem',
    paddingLeft: 5
  },
  optional: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  customCheckbox: {
    flexBasis: '35%'
  },

  actions: {
    marginRight: '0px',
    marginTop: '30px'
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

export default customItemDialogStyle;
