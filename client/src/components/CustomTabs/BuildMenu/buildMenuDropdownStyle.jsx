import { primaryBoxShadow, defaultFont } from '../../../assets/jss/material-dashboard-react.jsx';

const buildMenuDropdownStyle = theme => ({
  buttonLink: {
    width: 40,
    height: 40
  },
  startButtons: {
    flexBasis: '96%',
    color: '#FFFAFF'
  },
  startButton: {
    marginRight: '30px'
  },
  links: {
    width: '20px',
    height: '20px',
    zIndex: '4',
    [theme.breakpoints.down('lg')]: {
      display: 'block',
      width: '30px',
      height: '30px',
      color: '#a9afbb',
      marginRight: '15px'
    }
  },
  linkText: {
    zIndex: '4',
    ...defaultFont,
    fontSize: '14px'
  },
  popperClose: {
    pointerEvents: 'none'
  },
  dropdown: {
    borderRadius: '3px',
    border: '0',
    boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
    top: '100%',
    zIndex: '1000',
    minWidth: '160px',
    padding: '5px 0',
    margin: '2px 0 0',
    fontSize: '14px',
    textAlign: 'left',
    listStyle: 'none',
    backgroundColor: '#fff',
    WebkitBackgroundClip: 'padding-box',
    backgroundClip: 'padding-box'
  },
  dropdownItem: {
    ...defaultFont,
    fontSize: '13px',
    padding: '10px 20px',
    margin: '0 5px',
    borderRadius: '2px',
    WebkitTransition: 'all 150ms linear',
    MozTransition: 'all 150ms linear',
    OTransition: 'all 150ms linear',
    MsTransition: 'all 150ms linear',
    transition: 'all 150ms linear',
    display: 'block',
    clear: 'both',
    fontWeight: '400',
    lineHeight: '1.42857143',
    color: '#DADADA',
    whiteSpace: 'nowrap',
    height: 'unset',
    '&:hover': {
      backgroundColor: '#040405',
      color: '#FAFAFA',
      ...primaryBoxShadow
    }
  }
});

export default buildMenuDropdownStyle;
