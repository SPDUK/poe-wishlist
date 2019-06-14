import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '../../components/CustomButtons/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import settingsStyles from './settingsStyles';

const defaultOptions = {
  standard: [],
  hc: [],
  league: [],
  hcleague: []
};
class Settings extends Component {
  resetItems = () => {
    localStorage.setItem('leagueOptions', JSON.stringify(defaultOptions));
    localStorage.setItem('lastIndex', 0);
    window.location = 'https://poewishlist.xyz/dashboard';
  };
  resetCurrency = () => {
    localStorage.setItem('currencyOptions', JSON.stringify(defaultOptions));
    window.location = 'https://poewishlist.xyz/dashboard';
  };
  resetAll = () => {
    localStorage.setItem('league', 'standard');
    localStorage.setItem('lastIndex', 0);

    localStorage.setItem('leagueOptions', JSON.stringify(defaultOptions));
    localStorage.setItem('currencyOptions', JSON.stringify(defaultOptions));
    window.location = 'https://poewishlist.xyz/dashboard';
  };
  render() {
    const { classes } = this.props;
    return (
      <Grid spacing={24} container justify="center">
        <Grid className={classes.gridItem} xs={12} container justify="center" item>
          <Grid>
            <small className={classes.center}>Reset your currency history for all leagues</small>
          </Grid>
          <Grid className={classes.center} item xs={12}>
            <Button size="sm" color="info" onClick={this.resetCurrency}>
              Reset Currency
            </Button>
          </Grid>
        </Grid>
        <Grid className={classes.gridItem} xs={12} container justify="center" item>
          <Grid>
            <small className={classes.center}>Reset your items and custom items for all leagues</small>
          </Grid>
          <Grid className={classes.center} item xs={12}>
            <Button size="sm" color="warning" onClick={this.resetItems}>
              Reset Builds
            </Button>
          </Grid>
        </Grid>
        <Grid className={classes.gridItem} xs={12} container justify="center" item>
          <Grid>
            <small className={classes.center}>Reset everything at once</small>
          </Grid>
          <Grid className={classes.center} item xs={12}>
            <Button size="sm" color="danger" onClick={this.resetAll}>
              Reset Everything
            </Button>
          </Grid>
        </Grid>
        More options coming soon™
      </Grid>
    );
  }
}

export default withStyles(settingsStyles)(Settings);
