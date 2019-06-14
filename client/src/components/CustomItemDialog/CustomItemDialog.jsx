import React, { Component } from 'react';
import options from '../../json/searchMods.json';
import MenuList from './MenuList';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import createFilterOptions from 'react-select-fast-filter-options';
import IconButton from '@material-ui/core/IconButton';

import Select from 'react-select';
// theme components
import Button from '../CustomButtons/Button';

// material UI components
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import TextField from '@material-ui/core/TextField/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Close from '@material-ui/icons/Close';

import withStyles from '@material-ui/core/styles/withStyles';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';

import customItemDialogStyle from './customItemDialogStyle';
const filterOptions = createFilterOptions({
  options
});

const itemTypes = [
  { value: 'accessory.amulet', label: 'Amulet' },
  { value: 'accessory.belt', label: 'Belt' },
  { value: 'armour.chest', label: 'Body Armour' },
  { value: 'armour.boots', label: 'Boots' },
  { value: 'weapon.bow', label: 'Bow' },
  { value: 'weapon.claw', label: 'Claw' },
  { value: 'weapon.dagger', label: 'Dagger' },
  { value: 'flask', label: 'Flask' },
  { value: 'armour.gloves', label: 'Gloves' },
  { value: 'armour.helmet', label: 'Helmet' },
  { value: 'jewel', label: 'Jewel' },
  { value: 'weapon.oneaxe', label: 'One Handed Axe' },
  { value: 'weapon.onemace', label: 'One Handed Mace' },
  { value: 'weapon.onesword', label: 'One Handed Sword' },
  { value: 'armour.quiver', label: 'Quiver' },
  { value: 'accessory.ring', label: 'Ring' },
  { value: 'weapon.sceptre', label: 'Sceptre' },
  { value: 'armour.shield', label: 'Shield' },
  { value: 'weapon.staff', label: 'Staff' },
  { value: 'weapon.twoaxe', label: 'Two Handed Axe' },
  { value: 'weapon.twomace', label: 'Two Handed Mace' },
  { value: 'weapon.twosword', label: 'Two Handed Sword' },
  { value: 'weapon.wand', label: 'Wand' }
];

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
    color: '#d3d3d5',
    height: '40px',
    lineHeight: '35px'
  }),
  option: (base, state) => ({
    ...base,
    color: '#d3d3d5',
    backgroundColor: state.isFocused ? '#3c3e44' : '#484b51',
    '&:hover': {
      backgroundColor: '#2a2c31'
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

// split between explicit and implicit, implicits are for implicits AND crafted, if it's an enchant add {crafted} to the start `crafted${mod}`
// everything else (pseudo, explicit goes into explicitMods)
// give an input for each # in the mod name with an input , default value 0 to 0, if string contains # then it's an error and ask them to input

const CustomItemDialog = inject('stateStore')(
  observer(
    class CustomItemDialog extends Component {
      state = {
        mobile: window.innerWidth < 768,
        inputText: '',
        error: {},
        itemType: '',
        priceChecked: false,
        name: '',
        price: 0,
        url: 'https://',
        urlChecked: false,
        links: '0',
        mods: []
      };
      componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
      }
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
      }

      updateDimensions = () => {
        // only rerender if needed, changes display of modal view to fullscreen & adds close button
        if (window.innerWidth < 768 && !this.state.mobile) {
          this.setState({ mobile: true });
        } else if (window.innerWidth > 768 && this.state.mobile) {
          this.setState({ mobile: false });
        }
      };

      handleUrlChange = url => {
        this.setState({ url: url });
        setTimeout(() => {
          if (url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/)) {
            const errorState = this.state.error;
            errorState.url = '';
            this.setState({ error: errorState });
            return;
          }
          if (this.state.error.url) return;
          const errorState = this.state.error;
          errorState.url = 'Invalid URL:  URLs must begin with http:// or https://';
          this.setState({ error: errorState });
        }, 600);
      };

      handleRadioChange = e => {
        this.setState({ links: e.target.value });
      };
      handleTextChange = e => {
        const { value, name } = e.target;
        if (this.state.error[name] && value.length <= 35) {
          const error = this.state.error;
          error[name] = '';
          this.setState({ error });
        }
        if (!this.state.error[name] && value.length > 35) {
          const error = this.state.error;
          error[name] = `${name} too long`;
          this.setState({ error });
        }
        this.setState({ [name]: value });
      };
      handleItemTypeChange = e => {
        this.setState({ itemType: e.value });
      };
      handleModChange = mod => {
        const mods = this.state.mods;
        const type = mod.label.slice(1, mod.label.lastIndexOf(']'));
        const text = mod.label.slice(mod.label.lastIndexOf(']') + 1).trim();
        mods.push({
          type,
          text
        });

        this.setState({ mods: mods });
      };

      handleSubmit = e => {
        e.preventDefault();
        const { price, mods, itemType, links, name, url, error, urlChecked } = this.state;
        if ((error.url && urlChecked) || error.name) return;

        const item = {
          api_id: 0,
          chaosValue: parseInt(price) || 0,
          custom: true,
          explicitModifiers: mods.reduce((filtered, mod) => {
            if (mod.type !== 'implicit' || mod.type === 'enchant') filtered.push(mod.text);
            return filtered;
          }, []),
          flavourText: '',
          icon: 'https://web.poecdn.com/image/Art/2DItems/Divination/InventoryIcon.png?scale=1&scaleIndex=0&w=1&h=1',
          id: 0,
          implicitModifiers: mods.reduce((filtered, mod) => {
            if (mod.type === 'implicit' || mod.type === 'enchant') filtered.push(mod.text);
            return filtered;
          }, []),
          itemClass: 3,
          itemType: itemType,
          levelRequired: 0,
          links: links,
          lowConfidenceSparkline: null,
          name: name,
          sparkline: null,
          variant: null,
          urlChecked: url ? url : ''
        };
        this.props.stateStore.addCustomItemToBuild(item);
        this.setState({
          error: {},
          itemType: '',
          priceChecked: false,
          name: '',
          price: 0,
          url: 'https://',
          urlChecked: false,
          links: '0',
          mods: []
        });
        this.props.closeModal();
      };
      // checks if the current id is in the current build, if it is then disable the add to build button and change the text

      toggleCheckbox = e => {
        const { name } = e.target;
        this.setState(prevState => {
          return {
            [name]: !prevState[name]
          };
        });
      };

      removeMod = id => {
        const mods = this.state.mods;
        mods.splice(id, 1);
        this.setState({ mods: mods });
      };
      getTagBackground = type => {
        switch (type) {
          case 'pseudo':
            return '#232420';

          case 'explicit':
            return '#454851';

          case 'implicit':
            return '#65621E';

          case 'enchant':
            return '#8B579C ';

          case 'monster':
            return '#AD631B';
          case 'delve':
            return '#AD631B';

          case 'crafted':
            return '#0060BF';

          default:
            return 'black';
        }
      };

      // if a multiSelect option is selected, deselect the other
      render() {
        const { open, closeModal, buttonDisabled, classes } = this.props;
        const { mobile, error, price, priceChecked, url, name, urlChecked, links, mods } = this.state;
        return (
          <Dialog
            open={open}
            onClose={closeModal}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            fullScreen={mobile}
            fullWidth
            maxWidth="sm"
            className={classes.dialog}
            PaperProps={{ style: { background: '#35393f', minHeight: '70vh' } }}
          >
            <DialogTitle className="modal-item-dialog-title">
              <div className="modal-item-dialog-title-content">
                Create a new custom item
                {mobile && (
                  <Button className="modal-item-closebutton" size="sm" onClick={closeModal} color="danger">
                    Close
                  </Button>
                )}
              </div>
            </DialogTitle>
            <DialogContent className="modal-item-dialog-content">
              <form onSubmit={this.handleSubmit}>
                <TextField
                  autoFocus
                  required
                  label={'Item Name'}
                  value={name}
                  className={classes.textField}
                  onChange={this.handleTextChange}
                  margin="dense"
                  variant="filled"
                  fullWidth
                  error={Boolean(error.name)}
                  name="name"
                  helperText={error.name}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused
                    }
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      underline: classes.underline
                    }
                  }}
                />
                <Select
                  // value={itemType}
                  onChange={this.handleItemTypeChange}
                  // onInputChange={_.throttle(this.handleInputChange, 40)}
                  styles={selectStyles}
                  options={itemTypes}
                  // isLoading={itemsLoading}
                  classNamePrefix="my-select"
                  placeholder="Item Type"
                  backspaceRemovesValue=""
                />
                <div className={classes.optional}>
                  <TextField
                    type="number"
                    name="price"
                    value={price}
                    label={'Chaos Value'}
                    className={!priceChecked ? classes.hidden : classes.textField}
                    onChange={this.handleTextChange}
                    margin="dense"
                    variant="filled"
                    fullWidth
                    error={Boolean(error.price)}
                    helperText={error.price}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused
                      }
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        underline: classes.underline
                      },
                      inputProps: {
                        min: 0,
                        max: 99999
                      }
                    }}
                  />
                  <FormControlLabel
                    className={classes.customCheckbox}
                    name="priceChecked"
                    classes={{ label: classes.label }}
                    control={
                      <Checkbox
                        name="priceChecked"
                        checked={priceChecked}
                        color="primary"
                        onChange={this.toggleCheckbox}
                        classes={{
                          checked: classes.checked,
                          root: classes.root
                        }}
                      />
                    }
                    label="Custom Price?"
                    labelPlacement="start"
                  />
                </div>
                <div className={classes.optional}>
                  <TextField
                    name="url"
                    label={'Custom URL'}
                    value={url}
                    className={!urlChecked ? classes.hidden : classes.textField}
                    onChange={e => this.handleUrlChange(e.target.value)}
                    margin="dense"
                    variant="filled"
                    fullWidth
                    error={Boolean(error.url)}
                    helperText={error.url}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused
                      }
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        underline: classes.underline
                      }
                    }}
                  />
                  <FormControlLabel
                    className={classes.customCheckbox}
                    classes={{ label: classes.label }}
                    control={
                      <Checkbox
                        name="urlChecked"
                        checked={urlChecked}
                        classes={{
                          checked: classes.checked,
                          root: classes.root
                        }}
                        value="urlChecked"
                        color="primary"
                        onChange={this.toggleCheckbox}
                      />
                    }
                    label="Custom URL?"
                    labelPlacement="start"
                  />
                </div>
                <RadioGroup
                  aria-label="links"
                  name="links"
                  value={links}
                  onChange={this.handleRadioChange}
                  className={classes.radioGroup}
                >
                  {['0', '5', '6'].map(num => {
                    return (
                      <FormControlLabel
                        key={num}
                        value={num}
                        className={classes.multiOption}
                        classes={{ label: classes.label }}
                        label={num > 0 ? `min. ${num} Links` : 'All Links'}
                        labelPlacement="start"
                        control={
                          <Radio
                            color="primary"
                            classes={{
                              checked: classes.checked,
                              root: classes.root
                            }}
                          />
                        }
                      />
                    );
                  })}
                </RadioGroup>
                <div className={classes.modLabel}>Add an item mod</div>
                <Select
                  components={{ MenuList }}
                  onChange={this.handleModChange}
                  options={this.state.inputText.length > 2 ? options : []}
                  menuIsOpen={this.state.inputText.length > 2}
                  onInputChange={_.throttle(e => this.setState({ inputText: e }), 60)}
                  filterOptions={filterOptions}
                  styles={selectStyles}
                  classNamePrefix="my-select"
                  placeholder="Search for a mod"
                  backspaceRemovesValue=""
                />
                <div className={classes.modLabel}>Current Mods:</div>

                <div className={classes.itemMods}>
                  {mods.map((mod, idx) => {
                    return (
                      <div className={classes.itemMod} key={Math.random()}>
                        <div className={classes.itemModTag} style={{ background: this.getTagBackground(mod.type) }}>
                          {mod.type}
                        </div>
                        <div className={classes.itemModText}>{mod.text.replace(/\{.*?\}/, '')}</div>
                        <IconButton
                          className={classes.iconButton}
                          id={idx}
                          key="close"
                          aria-label="Close"
                          color="inherit"
                          onClick={_.debounce(() => this.removeMod(idx), 50)}
                        >
                          <Close />
                        </IconButton>
                      </div>
                    );
                  })}
                </div>
                <DialogActions style={{ marginRight: 0 }} className={classes.actions}>
                  <Button
                    disabled={Boolean(error.url && Boolean(urlChecked)) || Boolean(error.name) || buttonDisabled}
                    style={{ marginRight: 0 }}
                    type="submit"
                    color="primary"
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        );
      }
    }
  )
);

export default withStyles(customItemDialogStyle)(CustomItemDialog);
