import React from 'react';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import MenuList from '@material-ui/core/MenuList/MenuList';
import Grow from '@material-ui/core/Grow/Grow';
import Paper from '@material-ui/core/Paper/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden/Hidden';
import Popper from '@material-ui/core/Popper/Popper';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Snackbar from '../Snackbar/Snackbar';

// @material-ui/icons
import Menu from '@material-ui/icons/SettingsSharp';
// custom components
import Button from '../../components/CustomButtons/Button.jsx';
// styles
import headerLinksStyle from '../../assets/jss/material-dashboard-react/components/headerLinksStyle';

const HeaderLinks = inject('stateStore')(
  observer(
    class HeaderLinks extends React.Component {
      state = {
        open: false,
        mobile: window.innerWidth <= 1279
      };

      componentDidMount() {
        window.addEventListener('resize', this.resizeFunction);
      }
      componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFunction);
      }

      handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
      };

      handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
          return;
        }
        this.setState({ open: false });
      };

      handleSubmit = option => {
        this.props.stateStore.switchLeague(option);
        this.setState({ open: false });
      };

      resizeFunction = () => {
        // only rerender if needed, if the screen is wide enough display more items in the slider
        if (window.innerWidth <= 1279 && !this.state.mobile) {
          this.setState({ mobile: true });
        } else if (window.innerWidth > 1279 && this.state.mobile) {
          this.setState({ mobile: false });
        }
      };

      render() {
        const { classes, stateStore } = this.props;
        const { open, mobile } = this.state;
        return (
          <div>
            <Snackbar
              place="bc"
              color="danger"
              message={stateStore.apiError}
              open={Boolean(stateStore.apiError)}
              closeNotification={() => (stateStore.apiError = '')}
              close
            />
            {!stateStore.loadingBuilds ? (
              <div className={classes.manager}>
                {!mobile && <small>{stateStore.getLeagueName()}</small>}
                <Button
                  buttonRef={node => {
                    this.anchorEl = node;
                  }}
                  color={mobile ? 'transparent' : 'white'}
                  justIcon={!mobile}
                  simple={!mobile}
                  aria-owns={open ? 'menu-list-grow' : null}
                  aria-haspopup="true"
                  onClick={this.handleToggle}
                  className={classes.buttonLink}
                >
                  {!mobile ? (
                    <Tooltip placement="left" title="League Options Menu">
                      <Menu style={{ color: '#DADADA' }} className={classes.icons} />
                    </Tooltip>
                  ) : (
                    <Menu style={{ color: '#DADADA' }} className={classes.icons} />
                  )}
                  <Hidden lgUp implementation="css">
                    <p onClick={this.handleClick} className={classes.linkText}>
                      {mobile ? <span>{stateStore.getLeagueName()}</span> : null}
                    </p>
                  </Hidden>
                </Button>
                <Popper
                  open={open}
                  anchorEl={this.anchorEl}
                  transition
                  disablePortal
                  className={`${classNames({ [classes.popperClose]: !open })} ${classes.popperNav}`}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      id="menu-list-grow"
                      style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                      }}
                    >
                      <Paper style={{ background: '#17191c', color: 'DADADA' }}>
                        <ClickAwayListener onClickAway={this.handleClose}>
                          <MenuList role="menu">
                            <MenuItem onClick={() => this.handleSubmit('standard')} className={classes.dropdownItem}>
                              Switch to Standard League
                            </MenuItem>
                            <MenuItem onClick={() => this.handleSubmit('hc')} className={classes.dropdownItem}>
                              Switch to Hardcore League
                            </MenuItem>
                            <MenuItem onClick={() => this.handleSubmit('league')} className={classes.dropdownItem}>
                              Switch to Legion League
                            </MenuItem>
                            <MenuItem onClick={() => this.handleSubmit('hcleague')} className={classes.dropdownItem}>
                              Switch to Hardcore Legion League
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            ) : (
              <div>
                {window.location.pathname === '/dashboard' ? <CircularProgress style={{ color: '#DADADA' }} /> : null}
              </div>
            )}
          </div>
        );
      }
    }
  )
);

export default withStyles(headerLinksStyle)(HeaderLinks);
