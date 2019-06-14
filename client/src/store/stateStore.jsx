import { observable, action, decorate } from 'mobx';
import axios from 'axios';
import config from '../config/config.js';
import createFilterOptions from 'react-select-fast-filter-options';

const { BASE_URL } = config;

class StateStore {
  league = this.createLeague();
  leagueOptions = this.createOptions('leagueOptions');
  builds = this.leagueOptions[this.league];
  loadingBuilds = true;
  nameOptions = [];
  currencyPrices = [];
  loadingCurrency = true;
  exaltedPrice = 1;
  currencyOptions = this.createOptions('currencyOptions');
  userCurrency = this.currencyOptions[this.league];
  userChaos = this.userCurrency.length
    ? this.userCurrency[this.userCurrency.length - 1].userChaos
    : 0;
  userExalts = this.userCurrency.length
    ? this.userCurrency[this.userCurrency.length - 1].userExalts
    : 0;
  totalUserChaos = 0;
  totaluserExalts = 0;
  userConvertedChaos = 0;
  userConvertedExalts = 0;
  apiError = '';

  switchLeague(option) {
    if (this.league === option) return;
    this.league = option;
    this.loadingBuilds = true;
    this.loadingCurrency = true;
    // remove the lastIndex to pick up where left off and reset it to 0
    this.tabIndex = 0;
    localStorage.setItem('lastIndex', 0);
    // remove builds to stop potential bugs
    this.builds = [];
    // fetch item names for item searching
    this.fetchItemNameOptions().catch(
      err => (this.apiError = 'ERROR: There was an error fetching unique item names')
    );
    // reset user currency and fetch currency stats
    this.userCurrency = this.currencyOptions[this.league];
    this.userChaos = this.userCurrency.length
      ? this.userCurrency[this.userCurrency.length - 1].userChaos
      : 0;
    this.userExalts = this.userCurrency.length
      ? this.userCurrency[this.userCurrency.length - 1].userExalts
      : 0;
    this.fetchCurrency()
      .then(() => {
        this.loadingCurrency = false;
        this.calcUserCurrency();
      })
      .catch(err => {
        this.apiError = 'ERROR: There was an error fetching unique currency ';
      });

    // reload builds
    this.builds = this.leagueOptions[this.league];

    // fetch items from the builds
    this.fetchItems()
      .then(() => {
        this.loadingBuilds = false;
      })
      .catch(err => {
        this.props.stateStore.apiError = `There was an error fetching items for that build`;
      });

    // set a localStorage item with the league option to display the correct league on pageload
    return localStorage.setItem('league', option);
  }

  // UPDATE NEW LEAGUE NAMES HERE
  getLeagueName = () => {
    if (this.league === 'standard') return 'Standard';
    if (this.league === 'hc') return 'Hardcore';
    if (this.league === 'league') return 'Legion';
    if (this.league === 'hcleague') return 'Hardcore Legion';
    return 'Standard';
  };

  getTabIndex() {
    const index = localStorage.getItem('lastIndex');
    // if builds has that index, it is a valid option and return it
    if (this.builds.length && this.builds[index]) return parseInt(index, 0);
    return 0;
  }

  //  sets a localStorage item if one is not present
  // else it creates one, used to store the user's league eg: 'hc'
  // eslint-disable-next-line
  createLeague() {
    const league = localStorage.getItem('league');
    if (league) return league;
    localStorage.setItem('league', 'standard');
    return 'standard';
  }
  // takes in a string eg: 'currencyOptions' and finds the localStorage item for that string
  // if one is found, returns that localStorage item, else it creates the default object with empty arrays for all leagues
  // eslint-disable-next-line
  createOptions(type) {
    const options = JSON.parse(localStorage.getItem(type));
    if (options) return options;
    const createdOptions = {
      standard: [],
      hc: [],
      league: [],
      hcleague: []
    };
    localStorage.setItem(type, JSON.stringify(createdOptions));
    return createdOptions;
  }

  changeCurrentTab(index) {
    this.tabIndex = index;
    return localStorage.setItem('lastIndex', index);
  }

  importBuild = str => {
    // remove any potential whitespace to create the correct url
    const url = str.trim();
    axios
      .post(`${BASE_URL}/api/${this.league}/items/pob`, { url })
      .then(res => {
        const ids = res.data.filter(item => item.id).map(e => e.id);
        const customs = res.data.filter(item => item.custom);
        //  create a new build with the name ids and items
        const newBuild = {
          name: url,
          ids,
          customs,
          items: res.data
        };
        this.builds.push(newBuild);
        // create an empty object without the items
        const localBuilds = JSON.parse(localStorage.getItem('leagueOptions'));
        const newLocalBuild = {
          name: url,
          ids,
          customs
        };
        this.tabIndex = this.builds.length - 1;
        localStorage.setItem('lastIndex', this.tabIndex);
        // if the user already has builds, push to it, else make an array with the newLocalBuild as the first item
        localBuilds[this.league].push(newLocalBuild);
        return localStorage.setItem('leagueOptions', JSON.stringify(localBuilds));
      })
      .catch(err => {
        this.apiError = 'ERROR: There was a problem decoding that pastebin link';
      });
  };
  createNewBuild = str => {
    const name = str.trim();
    const newBuild = {
      name,
      ids: [],
      items: [],
      customs: []
    };
    this.builds.push(newBuild);
    // set the current to to be the last added tab
    this.tabIndex = this.builds.length - 1;

    localStorage.setItem('lastIndex', this.tabIndex);
    // create an empty object without the items
    const localBuilds = JSON.parse(localStorage.getItem('leagueOptions'));
    const newLocalBuild = {
      name,
      ids: [],
      customs: []
    };
    // if the user already has builds, push to it, else make an array with the newLocalBuild as the first item
    localBuilds[this.league].push(newLocalBuild);
    return localStorage.setItem('leagueOptions', JSON.stringify(localBuilds));
  };
  editBuildName = name => {
    this.builds[this.tabIndex].name = name;
    const localBuilds = JSON.parse(localStorage.getItem('leagueOptions'));
    localBuilds[this.league][this.tabIndex].name = name;
    localStorage.setItem('leagueOptions', JSON.stringify(localBuilds));
  };

  addCustomItemToBuild = selectedItem => {
    this.builds[this.tabIndex].customs.push(selectedItem);
    const newItemIndex = this.builds[this.tabIndex].items.findIndex(
      e => e.chaosValue < selectedItem.chaosValue
    );
    // if the value is higher than the next item in the list, place it into that index and move everything else down 1
    if (newItemIndex !== -1) this.builds[this.tabIndex].items.splice(newItemIndex, 0, selectedItem);
    // else just add onto the end of the list because it's the lowest value item on the list
    else this.builds[this.tabIndex].items.push(selectedItem);

    // set up localStorage IDs
    const localBuilds = JSON.parse(localStorage.getItem('leagueOptions'));
    localBuilds[this.league][this.tabIndex].customs.push(selectedItem);
    localStorage.setItem('leagueOptions', JSON.stringify(localBuilds));
  };

  addItemToBuild = selectedItem => {
    this.builds[this.tabIndex].ids.push(selectedItem.id);
    const newItemIndex = this.builds[this.tabIndex].items.findIndex(
      e => e.chaosValue < selectedItem.chaosValue
    );
    // if the value is higher than the next item in the list, place it into that index and move everything else down 1
    if (newItemIndex !== -1) this.builds[this.tabIndex].items.splice(newItemIndex, 0, selectedItem);
    // else just add onto the end of the list because it's the lowest value item on the list
    else this.builds[this.tabIndex].items.push(selectedItem);

    // set up localStorage IDs
    const localBuilds = JSON.parse(localStorage.getItem('leagueOptions'));
    localBuilds[this.league][this.tabIndex].ids.push(selectedItem.id);
    localStorage.setItem('leagueOptions', JSON.stringify(localBuilds));
  };

  removeItem = value => () => {
    // removing the item clicked from the current state, if the tab  being mapped over includes the item being deleted we
    //  remove the item being clicked

    // find the difference and splice out the correct item, remove length of ids
    const newState = this.builds.map((build, i) => {
      // mutate the current build deleting an item from
      if (this.tabIndex === i) {
        // this is the item that will be removed, we keep a variable to compare against it just in case it's removed otherwise
        const tempItem = build.items[value];
        if (build.items[value].custom) {
          return {
            name: build.name,
            ids: build.ids,
            items: build.items.splice(value, 1) && build.items,
            customs: build.customs.filter(e => e !== tempItem)
          };
        } else {
          return {
            name: build.name,
            ids: build.ids.filter(e => e !== tempItem.id),
            items: build.items.splice(value, 1) && build.items,
            customs: build.customs
          };
        }
      }
      // return the normal build if we are not currently mutating on this tab
      return {
        name: build.name,
        ids: build.ids,
        items: build.items,
        customs: build.customs
      };
    });
    this.builds = newState;
    // creating the new localStorage item (without items)
    const localState = newState.map(build => ({
      name: build.name,
      ids: build.ids,
      customs: build.customs
    }));
    const localBuilds = JSON.parse(localStorage.getItem('leagueOptions'));
    localBuilds[this.league] = localState;
    localStorage.setItem('leagueOptions', JSON.stringify(localBuilds));
  };

  removeBuild = () => {
    //  filters out the tab being deleted
    const newState = this.builds.filter((_, i) => this.tabIndex !== i);
    //  creates a new localStorage item from state after filtering out the tab being deleted
    const localState = newState.map(build => ({
      name: build.name,
      ids: build.ids,
      customs: build.customs
    }));
    // having a tabIndex of 0 does not cause an error as 0 is the default, so removing a tab from 0 to 0 is what should happen
    if (this.tabIndex > 0) this.tabIndex -= 1;
    else this.tabIndex = 0;
    localStorage.setItem('lastIndex', this.tabIndex);
    const localBuilds = JSON.parse(localStorage.getItem('leagueOptions'));
    localBuilds[this.league] = localState;
    localStorage.setItem('leagueOptions', JSON.stringify(localBuilds));

    // change the builds after doing everything else, because otherwise warnings appear in console
    this.builds = newState;
  };

  nameFilterOptions() {
    const options = this.nameOptions;
    return createFilterOptions({ options });
  }
  fetchItemNameOptions = () =>
    axios.get(`${BASE_URL}/api/${this.league}/items/names`).then(res => {
      this.nameOptions = res.data.map((item, i) => ({
        value: i,
        label: item.name
      }));
    });

  // returns a promise.all, one for each build in state
  // makes a post request and gets the item info&prices, if an ID is not in the database it is removed with the fixLocalStorage function
  // sets new state with the items&prices from each build
  fetchItems = () => {
    this.loadingBuilds = true;
    this.tabIndex = this.getTabIndex();
    return Promise.all(this.builds.map((build, i) => this.createItemsCall(build, i)));
  };

  createItemsCall = (build, i) =>
    axios.post(`${BASE_URL}/api/${this.league}/items/build`, { ids: build.ids }).then(res => {
      if (build.ids.length > res.data.length) {
        return this.fixLocalStorage(res.data, i).catch(err =>
          Promise.reject(new Error('An invalid ID was found'))
        );
      }
      // fetch unique items from ids, and concat that together with custom items

      // use the custom items found in localstorage and concat them together with the unique items from ids, to create one large
      // items array
      this.builds[i].items = res.data.concat(this.builds[i].customs);
    });

  // if a user enters an ID of an item that doesn't exist (eg item is no longer in the league or no longer available somehow)
  // it will remove that item from the build, because it can't be purchased any more
  fixLocalStorage = (data, buildIndex) => {
    this.loadingBuilds = true;
    // get the current build we need to fix
    const currentBuild = this.builds[buildIndex];
    // get the correct ids for the current build (from res.data request) so we can filter out the wrong ids
    const apiIds = data.map(d => d.id);
    // create a fixed build object that removes the broken ids
    const fixedBuild = {
      name: currentBuild.name,
      ids: apiIds,
      customs: currentBuild.customs
    };
    // map over the current builds and create an object that does not include the items if they exist, just the items needed by localstorage
    const fixedBuildState = this.builds.map((build, i) => {
      if (i === buildIndex) return fixedBuild;
      return {
        name: build.name,
        ids: build.ids,
        customs: currentBuild.customs
      };
    });
    //  set the builds state to be fixed, replacing the old broken build with a new one (no items, need to re-fetch correct data after)
    this.builds = fixedBuildState;
    const localBuilds = JSON.parse(localStorage.getItem('leagueOptions'));
    localBuilds[this.league] = fixedBuildState;

    localStorage.setItem('leagueOptions', JSON.stringify(localBuilds));
    return this.fetchItems()
      .then(() => {
        this.loadingBuilds = false;
      })
      .catch(err => {
        'An invalid item was found in your build, visit settings and reset your builds.';
        this.props.stateStore.apiError =
          'An invalid item was found in your build, visit settings and reset your builds.';
      });
  };

  fetchCurrency = () =>
    axios.get(`${BASE_URL}/api/${this.league}/currency`).then(res => {
      // sorts the prices from highest to lowest
      this.currencyPrices = res.data;
      // loops over all items until it finds the exalted orb and sets the price
      const found = res.data.find(e => e.name === 'Exalted Orb');
      if (!found) this.exaltedPrice = 1;
      else this.exaltedPrice = found.chaosValue;
      this.calcUserCurrency();
    });

  editUserCurrency = values => {
    this.userCurrency.push(values);
    this.userChaos = values.userChaos;
    this.userExalts = values.userExalts;
    this.calcUserCurrency();
    const localCurrency = JSON.parse(localStorage.getItem('currencyOptions'));
    localCurrency[this.league].push(values);
    localStorage.setItem('currencyOptions', JSON.stringify(localCurrency));
  };
  calcUserCurrency = () => {
    this.totalUserChaos = this.userChaos + this.userExalts * this.exaltedPrice;
    this.totaluserExalts = (this.totalUserChaos / this.exaltedPrice).toFixed(1);
    this.userConvertedChaos = (this.userChaos / this.exaltedPrice).toFixed(1);
    this.userConvertedExalts = this.userExalts * this.exaltedPrice;
  };

  calcExaltPrice = value => {
    const exaltedValue = value / this.exaltedPrice;
    // if the number is an integer, no need to trim it
    if (Number.isInteger(exaltedValue)) return exaltedValue;
    // if the number is 4.0111, trim it to just 4
    if (exaltedValue.toFixed(1).endsWith('0')) return exaltedValue.toFixed(0);
    // else if the number is 4.123 return 4.1
    return exaltedValue.toFixed(1);
  };
}

decorate(StateStore, {
  league: observable,
  leagueOptions: observable,
  tabIndex: observable,
  builds: observable,
  nameOptions: observable,
  loadingBuilds: observable,
  userChaos: observable,
  userExalts: observable,
  totalUserChaos: observable,
  totaluserExalts: observable,
  userConvertedChaos: observable,
  userConvertedExalts: observable,
  exaltedPrice: observable,
  currencyPrices: observable,
  loadingCurrency: observable,
  currencyOptions: observable,
  apiError: observable,
  changeCurrentTab: action,
  getTabIndex: action,
  fetchItemNameOptions: action,
  fetchItems: action,
  fixLocalStorage: action,
  removeItem: action,
  removeTab: action,
  fetchCurrency: action,
  editUserCurrency: action,
  calcUserCurrency: action,
  getLeagueName: action,
  calcExaltPrice: action
});

export default new StateStore();
