import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem/ListItem';
import List from '@material-ui/core/List/List';
// core components
import footerStyle from 'assets/jss/material-dashboard-react/components/footerStyle';

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="https://github.com/SPDUK/" className={classes.block}>
                Github
              </a>
            </ListItem>
            {/* <ListItem className={classes.inlineBlock}>
              <a href="#privacy" className={classes.block}>
                Privacy Policy
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#about" className={classes.block}>
                About
              </a>
            </ListItem> */}
          </List>
        </div>
        <p className={classes.right}>
          <span>
            <small>This site is fan-made and not affiliated with Grinding Gear Games in any way.</small>
          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(Footer);
