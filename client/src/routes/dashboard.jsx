// @material-ui/icons
import React, { Component } from 'react';
import Dashboard from '@material-ui/icons/Dashboard';
// import Person from '@material-ui/icons/Person';
import ToggleOff from '@material-ui/icons/ToggleOff';

// import ContentPaste from "@material-ui/icons/ContentPaste";
// import LibraryBooks from '@material-ui/icons/LibraryBooks';

class DynamicImport extends Component {
  state = {
    component: null
  };
  componentWillMount() {
    this.props.load().then(mod =>
      this.setState(() => ({
        component: mod.default
      }))
    );
  }
  render() {
    return this.props.children(this.state.component);
  }
}

const DashboardPage = props => (
  <DynamicImport load={() => import('../views/Dashboard/Dashboard.jsx')}>
    {Component => (Component === null ? <span> Loading...</span> : <Component {...props} />)}
  </DynamicImport>
);

// const PopularBuildsPage = props => (
//   <DynamicImport load={() => import('../views/PopularBuilds/PopularBuilds.jsx')}>
//     {Component => (Component === null ? <h1> Loading</h1> : <Component {...props} />)}
//   </DynamicImport>
// );

// const UsefulLinksPage = props => (
//   <DynamicImport load={() => import('../views/UsefulLinks/UsefulLinks.jsx')}>
//     {Component => (Component === null ? <h1> Loading</h1> : <Component {...props} />)}
//   </DynamicImport>
// );

const SettingsPage = props => (
  <DynamicImport load={() => import('../views/Settings/Settings.jsx')}>
    {Component => (Component === null ? <h1> Loading</h1> : <Component {...props} />)}
  </DynamicImport>
);

const dashboardRoutes = [
  {
    path: '/dashboard',
    sidebarName: 'Dashboard',
    navbarName: 'Dashboard',
    icon: Dashboard,
    component: DashboardPage
  },
  // {
  //   path: '/builds',
  //   sidebarName: 'Coming Soon',
  //   navbarName: 'Coming Soon',
  //   icon: Person,
  //   disabled: true,
  //   component: PopularBuildsPage
  // },
  // {
  //   path: '/links',
  //   sidebarName: 'Coming Soon',
  //   navbarName: 'Coming Soon',
  //   icon: LibraryBooks,
  //   component: UsefulLinksPage
  // },
  {
    path: '/settings',
    sidebarName: 'Settings',
    navbarName: 'Settings',
    icon: ToggleOff,
    component: SettingsPage
  },
  { redirect: true, path: '/', to: '/dashboard', navbarName: 'Redirect' }
];

export default dashboardRoutes;
