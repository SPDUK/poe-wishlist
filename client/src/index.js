import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import './assets/css/material-dashboard-react.css';
import ErrorBoundary from './helpers/ErrorBoundary';
import indexRoutes from './routes/index.jsx';
import stateStore from './store/stateStore';
// i don't know why this is needed but it stops an error that material UI has
// https://material-ui.com/style/typography/#migration-to-typography-v2
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const Root = (
  <ErrorBoundary>
    <Provider stateStore={stateStore}>
      <Router history={history}>
        <Switch>
          {indexRoutes.map((prop, key) => (
            <Route path={prop.path} component={prop.component} key={key} />
          ))}
        </Switch>
      </Router>
    </Provider>
  </ErrorBoundary>
);

ReactDOM.render(Root, document.getElementById('root'));
