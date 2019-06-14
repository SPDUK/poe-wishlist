import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';

import LazyLoad from 'react-lazyload';
import Slider from 'react-slick';

import './currencyprices.css';

//  get array
// turn every item in that array to a div with image and value
// turn that array of divs into subarrays of 5 items
const CurrencyPrices = inject('stateStore')(
  observer(
    class CurrencyPrices extends Component {
      state = {
        wide: window.innerWidth > 1279
      };
      componentDidMount() {
        this.props.stateStore
          .fetchCurrency()
          .then(() => (this.props.stateStore.loadingCurrency = false))
          .catch(err => {
            this.props.stateStore.apiError = 'ERROR: There was an error fetching unique currency ';
          });

        window.addEventListener('resize', this.updateDimensions);
      }
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
      }
      updateDimensions = () => {
        // only rerender if needed, if the screen is wide enough display more items in the slider
        if (window.innerWidth > 1279 && !this.state.wide) {
          this.setState({ wide: true });
        } else if (window.innerWidth < 1279 && this.state.wide) {
          this.setState({ wide: false });
        }
      };

      createCurrencies = arr => {
        const chunkedArray = [];
        const amount = this.state.wide ? parseInt(arr.length / 5, 10) : parseInt(arr.length / 10, 10);
        const createdCurrencies = arr.map(this.createCurrency);
        // split the currencies into groups to create a single item for the carousel for every N items
        while (createdCurrencies.length) {
          chunkedArray.push(
            <div className="currencyprices" key={chunkedArray.length}>
              {createdCurrencies.splice(0, amount)}
            </div>
          );
        }
        return chunkedArray;
      };

      calculateCurrency = value => {
        // turns 32.00 to 32, turns anything over exalted price to exalted value
        //  else turns it to 1.5c over 1, or 0.32 under 1
        if (value > this.props.stateStore.exaltedPrice) {
          const calc = value / this.props.stateStore.exaltedPrice;
          if (calc.toFixed(1).endsWith('0')) return `${calc.toFixed(0)}ex`;
          return `${calc.toFixed(1)}ex`;
        }
        if (value >= 10) {
          if (value.toFixed(1).endsWith('0')) return `${value.toFixed(0)}c`;
          return `${value.toFixed(0)}c`;
        }
        if (value >= 1) {
          if (value.toFixed(1).endsWith('0')) return `${value.toFixed(0)}c`;
          return `${value.toFixed(1)}c`;
        }
        return `${value.toFixed(2)}c`;
      };

      createCurrency = e => {
        const price = this.calculateCurrency(e.chaosValue);
        return (
          <div className="currencyprices-currency" key={e.name}>
            <img height="20px" alt={e.name} src={e.icon} /> <span>{price}</span>
          </div>
        );
      };
      render() {
        const settings = {
          dots: false,
          arrows: this.state.wide,
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 800
        };
        const { stateStore } = this.props;
        let currencies = [];
        if (!stateStore.loadingCurrency) {
          currencies = this.createCurrencies(stateStore.currencyPrices);
        }
        if (!stateStore.loadingCurrency) {
          return (
            <div className="currencyprices-container">
              <LazyLoad height="0" once>
                <Slider {...settings}>{currencies}</Slider>
              </LazyLoad>
            </div>
          );
        }
        return <CircularProgress style={{ color: '#DADADA' }} />;
      }
    }
  )
);

export default CurrencyPrices;
