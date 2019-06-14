import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

// material ui components
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import Grow from '@material-ui/core/Grow/Grow';
import withStyles from '@material-ui/core/styles/withStyles';
// custom material ui components
import Button from '../CustomButtons/Button';
// import custom
// styles
import editCurrencyStyle from './editCurrencyStyle.jsx';
import './editcurrency.css';

function Transition(props) {
  return <Grow {...props} />;
}

const EditCurrency = inject('stateStore')(
  observer(
    class EditCurrency extends Component {
      state = {
        userChaos: this.props.stateStore.userChaos,
        userExalts: this.props.stateStore.userExalts,
        error: {}
      };

      handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
      };
      handleError = orb => {
        const error = {};
        error[orb] = `Too many ${orb} orbs!`;
        this.setState({ error });
      };
      handleSubmit = e => {
        // TODO: add error checking
        e.preventDefault();
        if (this.state.userChaos > 99999) return this.handleError('chaos');
        if (this.state.userExalts > 99999) return this.handleError('exalted');
        if (this.state.error) this.setState({ error: {} });
        const values = {
          userChaos: Number(this.state.userChaos),
          userExalts: Number(this.state.userExalts)
        };
        this.props.stateStore.editUserCurrency(values);
        this.props.handleClose();
      };
      render() {
        const { open, handleClose, classes } = this.props;
        const { error, userChaos, userExalts } = this.state;
        return (
          <Dialog
            maxWidth="sm"
            scroll="paper"
            TransitionComponent={Transition}
            PaperProps={{ style: { background: '#35393f', margin: 0, width: '70vw' } }}
            className={classes.root}
            open={open}
            onClose={handleClose}
            aria-labelledby="currency-dialog-title"
          >
            <DialogTitle className={classes.title} id="currency-dialog-title">
              <span className={classes.content}>Edit Currency</span>
            </DialogTitle>
            <DialogContent>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  type="number"
                  name="userExalts"
                  id="userExalts"
                  value={userExalts}
                  onChange={this.handleChange}
                  autoComplete="off"
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
                  margin="dense"
                  variant="filled"
                  fullWidth
                  autoFocus
                  error={Boolean(error.exalted)}
                  label="Exalts"
                  helperText={error.exalted}
                />
                <TextField
                  type="number"
                  name="userChaos"
                  id="userChaos"
                  value={userChaos}
                  onChange={this.handleChange}
                  autoComplete="off"
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
                  margin="dense"
                  variant="filled"
                  fullWidth
                  error={Boolean(error.chaos)}
                  label="Chaos"
                  helperText={error.chaos}
                />
                <DialogActions style={{ marginRight: 0 }} className={classes.actions}>
                  <Button style={{ marginRight: 0 }} size="sm" type="submit" color="primary">
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

export default withStyles(editCurrencyStyle)(EditCurrency);
