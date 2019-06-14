import { defaultFont, primaryColor, dangerColor } from 'assets/jss/material-dashboard-react.jsx';
import tooltipStyle from 'assets/jss/material-dashboard-react/tooltipStyle.jsx';
import checkboxAndRadioStyle from 'assets/jss/material-dashboard-react/checkboxAndRadioStyle.jsx';

const itemsStyle = {
  ...tooltipStyle,
  ...checkboxAndRadioStyle,
  table: {
    marginBottom: '0',
    overflow: 'visible'
  },
  tableRow: {
    position: 'relative',
    borderBottom: '1px solid rgb(66, 69, 74)'
  },
  tableActions: {
    border: 'none',
    padding: '12px 8px !important',
    verticalAlign: 'middle',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  tableCell: {
    ...defaultFont,
    padding: '8px',
    verticalAlign: 'middle',
    border: 'none',
    lineHeight: '1.42857143',
    fontSize: '14px',
    textAlign: 'left',
    color: '#DADADA !important'
  },
  tableActionButton: {
    width: '27px',
    height: '27px'
  },
  tableActionButtonIcon: {
    width: '17px',
    height: '17px'
  },
  edit: {
    backgroundColor: 'transparent',
    color: primaryColor,
    boxShadow: 'none'
  },
  close: {
    backgroundColor: 'transparent',
    color: dangerColor,
    boxShadow: 'none'
  }
};
export default itemsStyle;
