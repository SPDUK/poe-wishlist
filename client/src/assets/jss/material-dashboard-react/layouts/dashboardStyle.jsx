import { drawerWidth, transition, container } from 'assets/jss/material-dashboard-react.jsx';

const padding = window.innerWidth > 768 ? '30px 5px' : '30px 0px';
const appStyle = theme => ({
  wrapper: {
    position: 'relative',
    top: '0',
    height: '100vh'
  },
  mainPanel: {
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    overflow: 'auto',
    position: 'relative',
    float: 'right',
    ...transition,
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch'
  },
  content: {
    marginTop: '70px',
    padding,
    minHeight: 'calc(100vh - 123px)'
  },
  container,
  map: {
    marginTop: '70px'
  }
});

export default appStyle;
