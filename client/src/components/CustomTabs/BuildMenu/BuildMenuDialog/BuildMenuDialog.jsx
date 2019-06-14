import React from 'react';
// material UI components
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import TextField from '@material-ui/core/TextField/TextField';
import Grow from '@material-ui/core/Grow/Grow';
import withStyles from '@material-ui/core/styles/withStyles';
// custom components
import Button from '../../../CustomButtons/Button';
// styles
import buildMenuDialogStyle from './buildMenuDialogStyle';

function Transition(props) {
  return <Grow {...props} />;
}

class BuildMenuDialog extends React.Component {
  state = {
    name: '',
    error: ''
  };
  handleChange = e => {
    if (this.state.error && e.target.value.length <= 35) {
      this.setState({ error: '' });
    }
    if (!this.state.error && e.target.value.length > 35) {
      this.setState({ error: 'Build name too long' });
    }
    this.setState({ [e.target.name]: e.target.value });
  };
  // calls the prop function (create or edit) with the name or the name prop, name prop will be the current value for edit
  // or "New Build" for new build
  handleSubmit = e => {
    e.preventDefault();

    if (this.state.name.length > 35) return this.setState({ error: 'Build name too long' });

    this.props.fn(this.state.name || this.props.name);
    this.props.handleDialogClose();
    this.setState({ name: '' });
  };

  // if the name is too long to fit in a label on mobile, truncate it
  getLabel = name => {
    if (window.innerWidth > 500) return name;
    return name.length > 15 ? `${name.slice(0, 15)}...` : name;
  };
  // gets the default value, but we only need it when there is a custom name already passed in
  getDefaultValue = name => {
    if (name === 'Pastebin Link' || name === 'New Build') return '';
    return name;
  };
  // TODO: add basic validation (name must not be empty, name must not be too long)
  render() {
    const { error } = this.state;
    const { handleDialogClose, open, classes, action, buttonDisabled } = this.props;
    return (
      <Dialog
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="buildmenu-dialog-title"
        maxWidth="sm"
        scroll="paper"
        TransitionComponent={Transition}
        PaperProps={{ style: { background: '#35393f', margin: 0, width: '70vw' } }}
        className={classes.root}
      >
        <DialogTitle className={classes.title} id="buildmenu-dialog-title">
          <span className={classes.content}>{action} Your Build</span>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <TextField
              autoComplete="off"
              label={this.getLabel(this.props.name) || 'Build Name'}
              defaultValue={this.getDefaultValue(this.props.name)}
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
              onChange={this.handleChange}
              margin="dense"
              variant="filled"
              fullWidth
              autoFocus
              error={Boolean(error)}
              name="name"
              helperText={error}
            />
            <DialogActions style={{ marginRight: 0 }} className={classes.actions}>
              <Button
                disabled={Boolean(error) || buttonDisabled}
                style={{ marginRight: 0 }}
                size="sm"
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

export default withStyles(buildMenuDialogStyle)(BuildMenuDialog);
