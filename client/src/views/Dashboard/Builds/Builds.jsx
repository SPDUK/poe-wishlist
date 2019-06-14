import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import queryBuilder from './queryBuilder';

// material ui components
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
// components
import Items from '../../../components/Items/Items';
import CustomTabs from '../../../components/CustomTabs/CustomTabs.jsx';

// contains css for builds, modal & customTabs
import './builds.css';

const Builds = inject('stateStore')(
  observer(
    class Builds extends Component {
      componentDidMount() {
        this.props.stateStore
          .fetchItems()
          .then(() => {
            this.props.stateStore.loadingBuilds = false;
          })
          .catch(err => {
            this.props.stateStore.apiError = `ERROR: There was a problem fetching build items`;
          });

        // fetch item names when the builds component loads instead of inside tabs or search, sometimes component remounts in those
        this.props.stateStore.fetchItemNameOptions().catch(err => {
          this.props.stateStore.apiError = 'ERROR: There was an error fetching unique item names';
        });
      }

      getPrice = item => {
        // return the closest integer unless the number is under 1
        const chaosValue = item.chaosValue.toFixed(1) < 1 ? item.chaosValue.toFixed(1) : item.chaosValue.toFixed(0);

        if (item.chaosValue >= this.props.stateStore.exaltedPrice) {
          return {
            exaltedValue: this.props.stateStore.calcExaltPrice(item.chaosValue),
            chaosValue
          };
        }
        return {
          chaosValue
        };
      };

      render() {
        const { stateStore } = this.props;
        // a single item in tabs is a single build with an index
        if (!stateStore.loadingBuilds && stateStore.builds) {
          const tabs = stateStore.builds.map((build, index) => {
            // get the index from each item in a build to make updating/deleting them easier
            const ids = build.items.map((_, i) => i);
            // if a build has items use those, if not use an empty arrays to stop errors when a build has no items key
            const names = [];
            const prices = [];
            const icons = [];
            const links = [];
            if (build.items && build.items.length) {
              build.items.forEach(item => {
                icons.push(item.icon);
                links.push(queryBuilder(item, stateStore.getLeagueName()));
                names.push(item.name);
                prices.push(this.getPrice(item));
              });
            }
            return {
              tabName: build.name,
              tabContent: (
                <Items itemIndexes={ids} links={links} icons={icons} buildIndex={index} prices={prices} names={names} />
              )
            };
          });
          return <CustomTabs headerColor="primary" tabs={tabs} />;
        }
        return <CircularProgress style={{ color: '#DADADA' }} />;
      }
    }
  )
);

export default Builds;
