import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import LazyLoad from 'react-lazyload';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Search from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
// custom material components
import Button from '../CustomButtons/Button';

// core components
import itemsStyle from '../../assets/jss/material-dashboard-react/components/itemsStyle';
import './items.css';

const chaosURL =
  'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1&v=c60aa876dd6bab31174df91b1da1b4f93';
const exaltURL = 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?scale=1&w=1&h=1';

const Items = inject('stateStore')(
  observer(
    class Items extends React.Component {
      state = {
        affordable: []
      };

      calcChaosPrice = price => {
        const value = price - this.props.stateStore.totalUserChaos;
        if (value.toString().endsWith('0')) return parseInt(value, 0);
        if (value < 1) return value.toFixed(1);
        return value.toFixed(0);
      };
      calcExaltPrice = price => {
        const value = (price - this.props.stateStore.totalUserChaos) / this.props.stateStore.exaltedPrice;
        if (value.toString().endsWith('0')) return parseInt(value, 0);
        return value.toFixed(1);
      };

      calcExaltPrice = price => {
        const exaltedValue = (price - this.props.stateStore.totalUserChaos) / this.props.stateStore.exaltedPrice;
        // if the number is an integer, no need to trim it
        if (Number.isInteger(exaltedValue)) return exaltedValue;
        // if the number is 4.0111, trim it to just 4
        if (exaltedValue.toFixed(1).endsWith('0')) return exaltedValue.toFixed(0);
        // else if the number is 4.123 return 4.1
        return exaltedValue.toFixed(1);
      };

      calcRequired = (price, value, links) => {
        const chaosPrice = this.calcChaosPrice(price);

        if (price <= this.props.stateStore.totalUserChaos) {
          return (
            <a href={links[value]}>
              <Button color="success" size="sm" simple>
                Purchase
              </Button>
            </a>
          );
        }
        if (price > this.props.stateStore.exaltedPrice) {
          const exaltedPrice = this.calcExaltPrice(price);
          return (
            <div>
              Required: {chaosPrice}×<img className="items-orb" alt="Chaos Orb" src={chaosURL} height="17px" />
              {exaltedPrice > 1 && (
                <span>
                  {' / '}
                  {exaltedPrice}×<img className="items-orb" alt="Exalted Orb" src={exaltURL} height="17px" />
                </span>
              )}
            </div>
          );
        }
        return (
          <div>
            Required: {chaosPrice}×<img className="items-orb" alt="chaos orb" src={chaosURL} height="17px" />
          </div>
        );
      };
      render() {
        const { itemIndexes, names, prices, stateStore, icons, links } = this.props;
        return (
          <div className="items">
            <LazyLoad height="0" once>
              <div>
                {itemIndexes.map(value => (
                  <div key={value} className="items-row">
                    <div className="items-cell items-icon">
                      {names[value].includes('Flask') ? (
                        <div className="flask">
                          <img src={icons[value]} alt={names[value]} />
                        </div>
                      ) : (
                        <img src={icons[value]} alt={names[value]} />
                      )}
                    </div>
                    <div className="items-cell items-item">
                      <div className="items-name">{names[value]}</div>
                      {prices[value].chaosValue > stateStore.exaltedPrice ? (
                        <div className="items-item-value">
                          {stateStore.calcExaltPrice(prices[value].chaosValue)}×
                          <img alt="exalted orb" src={exaltURL} height="17px" />
                        </div>
                      ) : prices[value].chaosValue > 0 ? (
                        <div className="items-item-value">
                          {prices[value].chaosValue}×<img alt="chaos orb" src={chaosURL} height="17px" />
                        </div>
                      ) : null}
                    </div>
                    <div className="items-cell items-required">
                      {this.calcRequired(prices[value].chaosValue, value, links)}
                    </div>
                    <div className="items-cell items-info">
                      <Tooltip id="tooltip-top-start" title="Search on pathofexile.com" placement="top">
                        <a href={links[value]}>
                          <IconButton aria-label="Close" className="items-info-item">
                            <Search className="items-info-item-search" />
                          </IconButton>
                        </a>
                      </Tooltip>
                      <Tooltip id="tooltip-top-start" title="Remove" placement="top-start">
                        <IconButton
                          onClick={stateStore.removeItem(value)}
                          aria-label="Close"
                          className="items-info-item"
                        >
                          <Close color="error" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </LazyLoad>
          </div>
        );
      }
    }
  )
);

Items.propTypes = {
  classes: PropTypes.object.isRequired,
  itemsIndexes: PropTypes.arrayOf(PropTypes.number),
  names: PropTypes.arrayOf(PropTypes.node)
};

export default withStyles(itemsStyle)(Items);
