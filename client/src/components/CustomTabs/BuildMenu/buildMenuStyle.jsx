import { defaultFont } from 'assets/jss/material-dashboard-react.jsx';

import buildMenuDropdownStyle from './buildMenuDropdownStyle.jsx';

const buildMenuStyle = theme => ({
  ...buildMenuDropdownStyle(theme),
  search: {
    '& > div': {
      marginTop: '0'
    }
  },
  linkText: {
    zIndex: '4',
    ...defaultFont,
    fontSize: '14px',
    margin: '0px'
  },
  margin: {
    zIndex: '4',
    margin: '0'
  },
  manager: {
    display: 'inline-block',
    height: 24,
    width: 24,
    transform: 'translate(-1px, -20px)'
  },
  searchWrapper: {
    display: 'inline-block'
  }
});

export default buildMenuStyle;
