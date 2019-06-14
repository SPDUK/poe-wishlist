import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { observer, inject } from 'mobx-react';
import Chartist from 'chartist';

// components
import Card from '../../../components/Card/Card.jsx';
import CardHeader from '../../../components/Card/CardHeader.jsx';
import CardBody from '../../../components/Card/CardBody.jsx';
import './currencyChart.scss';
const CurrencyChart = inject('stateStore')(
  observer(
    class CurrencyChart extends Component {
      // calcluates the price of each exalt/chaos combo the user has and turns it to just chaos for the chart
      getGraphData = () => {
        const userData = this.props.stateStore.userCurrency.map(
          e => e.userChaos + e.userExalts * this.props.stateStore.exaltedPrice
        );
        // lead the graph with a 0 as a starting point, instead of starting at 200, which can look weird
        return [0, ...userData];
      };

      getHighestNumber = () => {
        // gives an array of graph data in chaos values
        const values = this.getGraphData();
        if (values.length) {
          const max = Math.max(...values);
          // returns max + 10% of max rounded to the next 100, 1 returns 100
          return max + Math.ceil(max / 10 / 100) * 100;
        }
        return 50;
      };
      // TODO: figure out a more efficient way to do this, must be possible with math to divide or return by 5s or something
      calculateLeftPad = () => {
        const highest = this.getHighestNumber();
        if (highest > 10000000) return 35;
        if (highest > 1000000) return 20;
        if (highest > 100000) return 10;
        if (highest > 10000) return 5;
        return 0;
      };

      render() {
        const { classes, stateStore } = this.props;
        const delays = 80;
        const durations = 500;
        const currencyChartData = {
          data: {
            series: [
              // TODO: find a better way to do this? 0 is a falsey value so it doesn't work if user enters 0
              // only doing it this way because mobx won't rerender when they update, other option is if statement on getGraphData
              stateStore.userChaos >= 0 && stateStore.userExalts >= 0 && stateStore.userCurrency
                ? this.getGraphData()
                : []
            ]
          },
          options: {
            lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
            }),
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: this.calculateLeftPad()
            },
            high: this.getHighestNumber()
          },
          animation: {
            draw(data) {
              if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                  d: {
                    begin: 600,
                    dur: 600,
                    from: data.path
                      .clone()
                      .scale(1, 0)
                      .translate(0, data.chartRect.height())
                      .stringify(),
                    to: data.path.clone().stringify(),
                    easing: Chartist.Svg.Easing.easeOutQuint
                  }
                });
              } else if (data.type === 'point') {
                data.element.animate({
                  opacity: {
                    begin: (data.index + 1) * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: 'ease'
                  }
                });
              }
            }
          }
        };
        return (
          <Card chart>
            <CardHeader color="primary">
              <ChartistGraph
                className="ct-chart"
                data={currencyChartData.data}
                type="Line"
                options={currencyChartData.options}
                listener={currencyChartData.animation}
              />
              <h4 className={classes.cardTitle}>Currency History</h4>
            </CardHeader>
            <CardBody />
          </Card>
        );
      }
    }
  )
);

export default CurrencyChart;
