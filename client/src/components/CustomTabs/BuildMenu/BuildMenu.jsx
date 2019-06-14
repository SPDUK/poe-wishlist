import React from 'react';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';
import ReactAux from '../../ReactAux/ReactAux';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import MenuList from '@material-ui/core/MenuList/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import Popper from '@material-ui/core/Popper/Popper';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Add from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import MoreVertRounded from '@material-ui/icons/MoreVertRounded';

// core components
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog';
import BuildMenuDialog from './BuildMenuDialog/BuildMenuDialog';
import Button from '../../CustomButtons/Button.jsx';
import CustomButton from '../../../components/CustomButtons/Button';

import buildMenuStyle from './buildMenuStyle';

const BuildMenu = inject('stateStore')(
  observer(
    class BuildMenu extends React.Component {
      state = {
        anchorEl: null,
        name: '',
        dialogOpen: false,
        action: '',
        confirmDialogOpen: false,
        open: false,
        buttonDisabled: false
      };

      // functions for handling the non-delete options (create/delete)
      handleClose = () => {
        this.setState({ anchorEl: null });
      };
      // when clicking a menu option handleCloseOption will close the menu with an option
      // takes a function, a name, and an action, depending on what function is passed the child dialog will display this state being set
      //  displays the action and name as a prop, so inside the modal it shows the correct info eg "Edit <Build Name> from state here
      //  on submit it calls the function passed as props
      handleCloseOption = (fn, name, action) => {
        this.setState({ open: false, name, dialogOpen: true, fn, action, buttonDisabled: false });
      };
      // closes the dialog when clicking away
      handleDialogClose = () => {
        this.setState({ dialogOpen: false, open: false });
      };

      // displays the confirm delete menu and closes the menu
      handleConfirmOpen = () => {
        this.setState({ confirmDialogOpen: true, buttonDisabled: false });
        this.handleDialogClose();
      };
      // closes the confirm delete menu
      handleConfirmClose = () => {
        this.setState({ confirmDialogOpen: false, buttonDisabled: true });
      };

      // handles toggling the buildMenu open or closed
      handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
      };

      handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
          return;
        }
        this.setState({ open: false });
      };

      render() {
        const { classes, stateStore, tabs } = this.props;
        const { open, confirmDialogOpen, action, dialogOpen, name, fn, buttonDisabled } = this.state;
        return (
          <ReactAux>
            {!stateStore.loadingBuilds ? (
              <ReactAux>
                <ConfirmDialog
                  buttonDisabled={buttonDisabled}
                  handleConfirmClose={this.handleConfirmClose}
                  open={confirmDialogOpen}
                />
                <BuildMenuDialog
                  action={action}
                  handleDialogClose={this.handleDialogClose}
                  open={dialogOpen}
                  name={name}
                  fn={fn}
                  buttonDisabled={buttonDisabled}
                />
                {!tabs ? (
                  <div className={classes.startButtons}>
                    <CustomButton
                      onClick={() => this.handleCloseOption(stateStore.createNewBuild, 'New Build', 'Create')}
                      className={classes.startButton}
                      size="sm"
                      variant="outlined"
                      color="primary"
                    >
                      Create a new build
                    </CustomButton>
                    <CustomButton
                      onClick={() => this.handleCloseOption(stateStore.importBuild, 'Pastebin Link', 'Import')}
                      className={classes.startButton}
                      size="sm"
                      variant="outlined"
                      color="success"
                    >
                      Import from Path of Building
                    </CustomButton>
                  </div>
                ) : null}
                <div className={classes.manager}>
                  <Tooltip placement="top" title="Build Options Menu">
                    <Button
                      buttonRef={node => {
                        this.anchorEl = node;
                      }}
                      color={'white'}
                      justIcon={true}
                      simple={true}
                      aria-owns={open ? 'buildmenu-list-grow' : null}
                      aria-haspopup="true"
                      onClick={this.handleToggle}
                      className={classes.buttonLink}
                    >
                      {stateStore.builds.length ? (
                        <MoreVertRounded
                          style={{ height: '30px', width: '30px', color: '#dadada', transform: 'translateY(-5px)' }}
                        />
                      ) : (
                        <Add
                          style={{
                            height: '30px',
                            width: '30px',
                            color: '#2196f3',
                            transform: 'translateY(-6px)'
                          }}
                        />
                      )}
                    </Button>
                  </Tooltip>
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
                        id="buildmenu-list-grow"
                        style={{
                          transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                        }}
                      >
                        <Paper style={{ background: '#17191c', color: 'DADADA' }}>
                          <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList role="menu">
                              <MenuItem
                                className={classes.dropdownItem}
                                onClick={() =>
                                  this.handleCloseOption(stateStore.importBuild, 'Pastebin Link', 'Import')
                                }
                              >
                                Import from Path of Building
                              </MenuItem>
                              <MenuItem
                                className={classes.dropdownItem}
                                onClick={() => this.handleCloseOption(stateStore.createNewBuild, 'New Build', 'Create')}
                              >
                                Create New Build
                              </MenuItem>
                              {stateStore.builds.length && stateStore.builds[stateStore.tabIndex] ? (
                                <ReactAux>
                                  <MenuItem
                                    className={classes.dropdownItem}
                                    onClick={() =>
                                      this.handleCloseOption(
                                        stateStore.editBuildName,
                                        stateStore.builds[stateStore.tabIndex].name,
                                        'Rename'
                                      )
                                    }
                                  >
                                    Rename "{stateStore.builds[stateStore.tabIndex].name}"
                                  </MenuItem>
                                  <MenuItem className={classes.dropdownItem} onClick={this.handleConfirmOpen}>
                                    Delete "{stateStore.builds[stateStore.tabIndex].name}"
                                  </MenuItem>
                                </ReactAux>
                              ) : null}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </ReactAux>
            ) : (
              <CircularProgress style={{ color: '#DADADA' }} />
            )}
          </ReactAux>
        );
      }
    }
  )
);

export default withStyles(buildMenuStyle)(BuildMenu);
