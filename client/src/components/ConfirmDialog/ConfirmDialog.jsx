import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import { observer, inject } from 'mobx-react';

// material ui components
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
// custom material ui components
import Button from '../CustomButtons/Button';
import Grow from '@material-ui/core/Grow/Grow';

import './confirmDialog.scss';

function Transition(props) {
  return <Grow {...props} />;
}
const ConfirmDialog = inject('stateStore')(
  observer(
    class ConfirmDialog extends Component {
      handleRemove = e => {
        e.preventDefault();
        this.props.handleConfirmClose();

        // let the animation play before removing
        setTimeout(() => {
          this.props.stateStore.removeBuild();
        }, 100);
      };
      render() {
        const { stateStore, open, handleConfirmClose, buttonDisabled } = this.props;
        // if there is a currently selected build and it has a name, show the delete modal
        if (stateStore.builds.length && stateStore.builds[stateStore.tabIndex]) {
          return (
            <Dialog
              open={open}
              onClose={handleConfirmClose}
              aria-labelledby="responsive-dialog-title"
              scroll="paper"
              TransitionComponent={Transition}
              className="confirmdialog"
              // changes background to the correct color
              PaperProps={{ style: { background: '#35393f' } }}
            >
              <DialogTitle className="confirmdialog-title">
                <div className="confirmdialog-title-content">Delete {stateStore.builds[stateStore.tabIndex].name}?</div>
              </DialogTitle>
              <DialogActions className="confirmdialog-actions">
                <form onSubmit={this.handleRemove}>
                  <Button disabled={buttonDisabled} size="sm" type="submit" color="danger">
                    Delete
                  </Button>
                </form>
              </DialogActions>
            </Dialog>
          );
        }
        return null;
      }
    }
  )
);

export default ConfirmDialog;
