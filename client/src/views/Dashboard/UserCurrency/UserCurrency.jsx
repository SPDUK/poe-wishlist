import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';

import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import Button from '../../../components/CustomButtons/Button';

import EditCurrency from '../../../components/EditCurrency/EditCurrency';

import './usercurrency.css';
import ReactAux from '../../../components/ReactAux/ReactAux';

const exaltURL = 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?scale=1&w=1&h=1';
const chaosURL =
  'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1&v=c60aa876dd6bab31174df91b1da1b4f93';

const Stats = inject('stateStore')(
  observer(
    class Stats extends Component {
      state = {
        editCurrencyOpen: false,
        addProfileOpen: false
      };

      handleClose = modal => {
        const obj = {};
        obj[modal] = false;
        this.setState(obj);
      };
      render() {
        const { classes, stateStore } = this.props;
        const { editCurrencyOpen } = this.state;
        return (
          <ReactAux>
            <EditCurrency handleClose={() => this.handleClose('editCurrencyOpen')} open={editCurrencyOpen} />
            <Card>
              <CardHeader color="primary" stats>
                <div className="stats-header">
                  <h4 className={classes.cardTitle}>Your Currency</h4>
                  <div className="stats-header-currency">
                    <h4>
                      <img className="stats-header-currency-orb" src={exaltURL} alt="chaos orb" height="17px" />×
                      {stateStore.userExalts}
                    </h4>
                    <h4>
                      <img className="stats-header-currency-orb" src={chaosURL} alt="chaos orb" height="17px" />×
                      {stateStore.userChaos}
                    </h4>
                  </div>
                </div>
              </CardHeader>
              <div className="stats-footer">
                <Button
                  onClick={() => this.setState({ editCurrencyOpen: true })}
                  className="stats-footer-button"
                  size="sm"
                  simple
                >
                  Edit Currency
                </Button>
              </div>
            </Card>
          </ReactAux>
        );
      }
    }
  )
);

export default Stats;
