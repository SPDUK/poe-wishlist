import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import axios from 'axios';

// select searchbar
import Select from 'react-select';
// material ui components
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';

// custom material ui components
import Card from '../../components/Card/Card.jsx';
import CardBody from '../../components/Card/CardBody.jsx';
import CardHeader from '../../components/Card/CardHeader.jsx';
import customTabsStyle from '../../assets/jss/material-dashboard-react/components/customTabsStyle.jsx';
import Button from '@material-ui/core/Button/Button';
// components
import ItemModal from '../ItemModal/ItemModal';
import BuildMenu from './BuildMenu/BuildMenu';
import ReactAux from '../../components/ReactAux/ReactAux';
import CustomItemDialog from '../CustomItemDialog/CustomItemDialog';

// contains css for CustomTabs & CustomTabsMenu
import './customtabs.scss';
import config from '../../config/config';
const { BASE_URL } = config;

const selectStyles = {
  menu: base => ({
    ...base,
    background: '#484b51',
    width: '100%'
  }),
  placeholder: base => ({
    ...base,
    color: '#b9bbbd'
  }),
  input: base => ({
    ...base,
    color: '#d3d3d5'
  }),
  option: (base, state) => ({
    ...base,
    color: '#d3d3d5',
    backgroundColor: state.isFocused ? '#2a2c31' : '#484b51',
    '&:hover': {
      backgroundColor: '#3c3e44'
    }
  }),
  control: base => ({
    ...base,
    borderColor: '#2a2c31',
    background: '#484b51',
    transition: '0.1s ease',
    color: '#d3d3d5',
    '&:hover': {
      borderColor: '#2a2c31',
      backgroundColor: '#3c3e44'
    },
    '&:focus': {
      borderColor: '#2a2c31',
      backgroundColor: '#3c3e44'
    },
    boxShadow: 'none'
  }),
  singleValue: base => ({
    ...base,
    color: '#d3d3d5'
  })
};
const CustomTabs = inject('stateStore')(
  observer(
    class CustomTabs extends React.Component {
      state = {
        selectedOption: undefined,
        modalOpen: false,
        modalItems: [],
        buttonDisabled: false,
        itemsLoading: false,
        customItemDialogOpen: false,
        customItemDialogButtonDisabled: false
      };

      handleChange = (event, value) => {
        this.props.stateStore.changeCurrentTab(value);
      };

      handleSearchChange = selectedOption => {
        if (selectedOption.label) {
          this.setState({ itemsLoading: true });
          return axios
            .post(`${BASE_URL}/api/${this.props.stateStore.league}/items/findbyname`, {
              name: selectedOption.label
            })
            .then(res => {
              this.setState({
                selectedOption,
                modalOpen: true,
                modalItems: res.data,
                buttonDisabled: false,
                itemsLoading: false
              });
            })
            .catch(err => {
              this.props.stateStore.apiError = `ERROR: There was an error fetching ${selectedOption.label}`;
            });
        }
      };

      closeModal = () => {
        this.setState({ modalOpen: false });
        //  removes the items after fade so they don't instantly dissapear before the fade-out animation ends
        setTimeout(() => {
          this.setState({ modalItems: [] });
        }, 200);
      };

      handleSubmit = item => {
        this.props.stateStore.addItemToBuild(item);
        this.setState({ modalOpen: false, buttonDisabled: true });

        setTimeout(() => {
          this.setState({ modalItems: [] });
        }, 200);
      };

      handleInputChange = input => input;

      openCustomItemDialog = () =>
        this.setState({ customItemDialogOpen: true, customItemDialogButtonDisabled: false });
      closeCustomItemDialog = () =>
        this.setState({ customItemDialogOpen: false, customItemDialogButtonDisabled: true });

      render() {
        const { classes, headerColor, plainTabs, tabs, stateStore } = this.props;
        const {
          selectedOption,
          modalOpen,
          modalItems,
          buttonDisabled,
          itemsLoading,
          customItemDialogOpen,
          customItemDialogButtonDisabled
        } = this.state;

        return (
          <ReactAux>
            <CustomItemDialog
              open={customItemDialogOpen}
              buttonDisabled={customItemDialogButtonDisabled}
              closeModal={this.closeCustomItemDialog}
            />
            <Card style={{ zIndex: 1000 }} plain={plainTabs}>
              <CardHeader style={{ display: 'flex' }} color={headerColor} plain={plainTabs}>
                {tabs.length ? (
                  <Tabs
                    style={{ flexBasis: '97%' }}
                    value={stateStore.tabIndex}
                    onChange={this.handleChange}
                    classes={{
                      root: classes.tabsRoot,
                      indicator: classes.displayNone
                    }}
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {tabs.map((prop, key) => {
                      let icon = {};
                      if (prop.tabIcon) {
                        icon = {
                          icon: <prop.tabIcon />
                        };
                      }
                      return (
                        <Tab
                          classes={{
                            root: classes.tabRootButton,
                            labelContainer: classes.tabLabelContainer,
                            label: classes.tabLabel,
                            selected: classes.tabSelected,
                            wrapper: classes.tabWrapper
                          }}
                          key={key}
                          label={prop.tabName}
                          {...icon}
                        />
                      );
                    })}
                  </Tabs>
                ) : null}
                <BuildMenu tabs={tabs.length} />
              </CardHeader>
              <CardBody>
                {tabs.length ? (
                  <div className="customtabs-search">
                    <Button
                      onClick={this.openCustomItemDialog}
                      variant="outlined"
                      size="small"
                      type="submit"
                      className="customtabs-search-custom"
                    >
                      Custom Item
                    </Button>
                    <Select
                      value={selectedOption}
                      onChange={this.handleSearchChange}
                      filterOptions={stateStore.filterOptions}
                      options={stateStore.nameOptions}
                      styles={selectStyles}
                      isLoading={itemsLoading}
                      classNamePrefix="my-select"
                      className="customtabs-search-select"
                      placeholder="Search for an item..."
                      backspaceRemovesValue=""
                    />
                  </div>
                ) : null}
                {tabs.map((prop, key) => {
                  if (key === stateStore.tabIndex) {
                    return (
                      <div key={key}>
                        {selectedOption && selectedOption.label ? (
                          <ItemModal
                            items={modalItems}
                            handleSubmit={this.handleSubmit}
                            closeModal={this.closeModal}
                            open={modalOpen}
                            buttonDisabled={buttonDisabled}
                          />
                        ) : null}
                        {prop.tabContent}
                      </div>
                    );
                  }
                  return null;
                })}
              </CardBody>
            </Card>
          </ReactAux>
        );
      }
    }
  )
);

CustomTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  headerColor: PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary']),
  title: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
      tabIcon: PropTypes.func,
      tabContent: PropTypes.node.isRequired
    })
  ),
  rtlActive: PropTypes.bool,
  plainTabs: PropTypes.bool
};

export default withStyles(customTabsStyle)(CustomTabs);
