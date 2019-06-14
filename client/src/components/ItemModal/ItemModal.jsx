import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { observer, inject } from 'mobx-react';

// theme components
import GridItem from '../Grid/GridItem';
import GridContainer from '../Grid/GridContainer';
import Button from '../CustomButtons/Button';
import ItemLinks from './ItemLinks/ItemLinks';

// styles
import './itemmodal.css';

// used to find which items can have a possible 6 link, if they can't then don't display the number of links
const possible6Links = ['Two Handed Sword', 'Two Handed Axe', 'Two Handed Mace', 'Staff', 'Bow', 'Body Armour'];
const chaosURL =
  'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1&v=c60aa876dd6bab31174df91b1da1b4f93';
const exaltURL = 'https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?scale=1&w=1&h=1';
// has if statements for most things, uses > 0 because if you use 0 it shows 0
// get border-bottom-color for modal-item-explicit and implicit
// get background & color & border-color for title

const ItemModal = inject('stateStore')(
  observer(
    class ItemModal extends React.Component {
      state = {
        mobile: window.innerWidth < 768
      };
      componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
      }
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
      }

      getflavourText = text => {
        //  removes <size> and other useless things from API response.
        if (text.includes('{')) {
          return text
            .substring(text.lastIndexOf('{') + 1, text.lastIndexOf('}'))
            .split('|')
            .map(line => <p key={line}>{line}</p>);
        }
        return text.split('|').map(line => <p key={line}>{line}</p>);
      };

      // maps over each mod and cleans the text to remove {} and <>, adds in the color of the item type also
      getMods = mods => mods.map(mod => this.cleanModText(mod.text));

      cleanModText = text => {
        // take the <corrrupted> part of the string out and check what it is, change the text colour based on the style
        if (text.includes('{')) {
          const color = this.checkModStyle(text.substring(text.lastIndexOf('<') + 1, text.lastIndexOf('>')));
          let fixedText = text.substring(text.lastIndexOf('{') + 1, text.lastIndexOf('}'));
          // sometimes the API has one too many brackets for some reason, so remove them from display
          if (fixedText.includes('{')) fixedText = fixedText.replace('{', '');
          if (fixedText.includes('}')) fixedText = fixedText.replace('}', '');
          return (
            <p style={{ color }} key={text}>
              {fixedText}
            </p>
          );
        }
        return <p key={text}>{text}</p>;
      };

      // takes in a style and returns a color
      checkModStyle = style => {
        if (style === 'corrupted') return '#d20000';
        if (style === 'uniqueitem') return '#af6025';
        if (style === 'prophecy') return '#b54bff';
        if (style === 'rareitem') return '#ffff77';
        if (style === 'gemitem') return '#1aa29b';
        if (style === 'currencyitem') return '#aa9e82';
        if (style === 'divination') return '#0ebaff';
        if (style === 'whiteitem') return '#7f7f7f';
        // if no style is given then this will default to blue (magic item)
      };

      pluralize = (arr, word) => {
        if (arr.length > 1) return `${word}s`;
        return word;
      };

      updateDimensions = () => {
        // only rerender if needed, changes display of modal view to fullscreen & adds close button
        if (window.innerWidth < 768 && !this.state.mobile) {
          this.setState({ mobile: true });
        } else if (window.innerWidth > 768 && this.state.mobile) {
          this.setState({ mobile: false });
        }
      };

      calculateChaosPrice = value => {
        if (value.toFixed(1) < 1) return value.toFixed(1);
        return value.toFixed(0);
      };

      // checks if the current id is in the current build, if it is then disable the add to build button and change the text
      checkifInBuild = id => this.props.stateStore.builds[this.props.stateStore.tabIndex].ids.includes(id);

      render() {
        const { open, closeModal, items, handleSubmit, buttonDisabled, stateStore } = this.props;
        const { mobile } = this.state;
        const itemInfo = items.map(item => {
          const color = item.itemClass === 9 ? '#79a163' : '#af6025';
          const backgroundColor = item.itemClass === 9 ? '#1a2315' : '#231307';
          // if the item can have 6 links this is true, else false, used to display number of links and resize the image to fit sockets over top
          const possible6Link = possible6Links.includes(item.itemType);
          // if the item length is even and over 1, show a 2x2 layout, else show 1 by 1
          const width = items.length % 2 === 0 ? 6 : 12;
          const background =
            item.itemClass === 9
              ? 'linear-gradient(to left, #111111 0%, #79a163 50%, #79a163 50%, #111111 100%) left bottom #111111 no-repeat'
              : 'linear-gradient(to left, #111111 0%, #af6025 50%, #af6025 50%, #111111 100%) left bottom #111111 no-repeat';

          return (
            <GridItem key={item.id} xs={12} sm={12} lg={width} className="modal-item">
              {item.chaosValue ? (
                <div className="modal-item">
                  <div
                    style={{ borderBottomColor: color, color, borderColor: color, background: backgroundColor }}
                    className="modal-item-title"
                  >
                    <p>{item.name}</p>
                    <p>{item.itemType === 'Unknown' ? undefined : item.itemType}</p>
                  </div>
                  {item.levelRequired > 0 && (
                    <div style={{ background }} className="modal-item-levelrequired">
                      <span>Requires Level </span>
                      {item.levelRequired}
                    </div>
                  )}
                  {item.implicitModifiers.length > 0 && (
                    <div style={{ background }} className="modal-item-split">
                      {this.getMods(item.implicitModifiers)}
                    </div>
                  )}
                  {item.explicitModifiers.length > 0 && (
                    <div style={{ background }} className="modal-item-split">
                      {this.getMods(item.explicitModifiers)}
                    </div>
                  )}
                  {item.flavourText && (
                    <div className="modal-item-split modal-item-flavourtext">
                      {this.getflavourText(item.flavourText)}
                    </div>
                  )}
                  <div className="modal-item-icon">
                    <img
                      className={possible6Link && item.links >= 5 ? 'modal-item-icon-linked' : ''}
                      alt={item.name}
                      src={item.icon}
                      height={possible6Link ? '140px' : ''}
                      width={possible6Link ? '94px' : ''}
                    />
                    {possible6Link && item.links >= 5 ? <ItemLinks numLinks={item.links} /> : undefined}
                  </div>
                  <div className="modal-item-info">
                    <p>
                      {this.calculateChaosPrice(item.chaosValue)}×<img src={chaosURL} alt="chaos orb" />
                      {item.chaosValue >= stateStore.exaltedPrice && (
                        <span>
                          / {stateStore.calcExaltPrice(item.chaosValue)}×<img src={exaltURL} alt="exalted orb" />
                        </span>
                      )}
                    </p>
                    <Button
                      onClick={() => handleSubmit(item)}
                      className="modal-item-addbutton"
                      fullWidth
                      color={this.checkifInBuild(item.id) || buttonDisabled ? 'white' : 'primary'}
                      disabled={this.checkifInBuild(item.id) || buttonDisabled}
                    >
                      {this.checkifInBuild(item.id) ? 'Already in build' : 'Add to build'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div />
              )}
            </GridItem>
          );
        });

        return (
          <Dialog
            open={open}
            onClose={closeModal}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            fullScreen={mobile}
            maxWidth="md"
            PaperProps={{ style: { background: '#35393f' } }}
          >
            <DialogTitle className="modal-item-dialog-title">
              <div className="modal-item-dialog-title-content">
                <div>{`${items.length} ${this.pluralize(items, 'Variation')} found`}</div>
                {mobile && (
                  <Button className="modal-item-closebutton" size="sm" onClick={closeModal} color="danger">
                    Close
                  </Button>
                )}
              </div>
            </DialogTitle>
            <DialogContent className="modal-item-dialog-content">
              <GridContainer>{itemInfo}</GridContainer>
            </DialogContent>
          </Dialog>
        );
      }
    }
  )
);

export default ItemModal;
