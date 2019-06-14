import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// creates a beautiful scrollbar
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import ReactGA from 'react-ga';

// core components
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Sidebar from '../../components/Sidebar/Sidebar';

import dashboardRoutes from '../../routes/dashboard.jsx';

import dashboardStyle from '../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx';

const imageURLs = [
  'https://res.cloudinary.com/dmjolhdaq/image/upload/v1551724826/PoeWishlist/witch.jpg'
];

const image = imageURLs[Math.floor(Math.random() * imageURLs.length)];

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect) return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);
function initializeReactGA() {
  ReactGA.initialize('UA-130637532-1');
  ReactGA.pageview('/dashboard');
}

class App extends React.Component {
  state = {
    mobileOpen: false
  };
  componentDidMount() {
    initializeReactGA();
    window.addEventListener('resize', this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      // eslint-disable-next-line
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        // eslint-disable-next-line
        this.setState({ mobileOpen: false });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction);
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  resizeFunction = () => {
    if (window.innerWidth >= 1279) {
      this.setState({ mobileOpen: false });
    }
  };
  render() {
    const { classes, ...rest } = this.props;
    const { mobileOpen } = this.state;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={dashboardRoutes}
          logoText="poewishlist.xyz"
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={mobileOpen}
          onOpen={this.handleDrawerToggle}
          color="primary"
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          <Header routes={dashboardRoutes} handleDrawerToggle={this.handleDrawerToggle} {...rest} />
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(App);
