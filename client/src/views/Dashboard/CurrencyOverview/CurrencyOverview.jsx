import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

// components
import Table from '../../../components/Table/Table';
import Card from '../../../components/Card/Card';
import CardHeader from '../../../components/Card/CardHeader';
import CardBody from '../../../components/Card/CardBody';

const CurrencyOverview = inject('stateStore')(
  observer(
    class CurrencyOverview extends Component {
      calculatePercent = orb => {
        const amount = (100 * this.props.stateStore[orb]) / this.props.stateStore.totalUserChaos;
        if (amount) return amount.toFixed(1);
        return 0;
      };

      render() {
        const { classes, stateStore } = this.props;
        return (
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Currency Overview</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHead={['Type', 'Amount in Chaos', 'Amount in Exalts', 'Percent']}
                tableData={[
                  ['Total', `${parseInt(stateStore.totalUserChaos)}c`, `${stateStore.totaluserExalts}ex`, '100%'],
                  [
                    'Chaos',
                    `${parseInt(stateStore.userChaos)}c`,
                    `${stateStore.userConvertedChaos}ex`,
                    `${this.calculatePercent('userChaos')} %`
                  ],
                  [
                    'Exalts',
                    `${parseInt(stateStore.userConvertedExalts)}c`,
                    `${stateStore.userExalts}ex`,
                    `${this.calculatePercent('userConvertedExalts')} %`
                  ]
                ]}
              />
            </CardBody>
          </Card>
        );
      }
    }
  )
);

export default CurrencyOverview;
