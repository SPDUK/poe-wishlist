import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import GridItem from '../../components/Grid/GridItem.jsx';
import GridContainer from '../../components/Grid/GridContainer.jsx';
import dashboardStyle from '../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx';
import ReactAux from '../../components/ReactAux/ReactAux';

// Components
import UserCurrency from './UserCurrency/UserCurrency';
import Builds from './Builds/Builds';
import CurrencyChart from './CurrencyChart/CurrencyChart';
import CurrencyOverview from './CurrencyOverview/CurrencyOverview';
import CurrencyPrices from './CurrencyPrices/CurrencyPrices';

class Dashboard extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <ReactAux>
        <GridContainer>
          <GridItem xs={12}>
            <CurrencyPrices />
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12} xl={8}>
            <Builds classes={classes} />
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12} xl={4}>
            <GridContainer>
              <GridItem xs={12} lg={4} xl={12}>
                <UserCurrency classes={classes} />
              </GridItem>
              <GridItem xs={12} lg={8} xl={12}>
                <CurrencyChart classes={classes} />
              </GridItem>
            </GridContainer>
            <CurrencyOverview classes={classes} />
          </GridItem>
        </GridContainer>
      </ReactAux>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
