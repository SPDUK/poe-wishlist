import React, { Component } from 'react';
const defaultOptions = {
  standard: [],
  hc: [],
  league: [],
  hcleague: []
};
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  resetItems = () => {
    localStorage.setItem('leagueOptions', JSON.stringify(defaultOptions));
    localStorage.setItem('lastIndex', 0);
    window.location = 'https://poewishlist.xyz/dashboard';
  };
  resetCurrency = () => {
    localStorage.setItem('currencyOptions', JSON.stringify(defaultOptions));
    window.location = 'https://poewishlist.xyz/dashboard';
  };
  resetAll = () => {
    localStorage.setItem('league', 'standard');
    localStorage.setItem('lastIndex', 0);

    localStorage.setItem('leagueOptions', JSON.stringify(defaultOptions));
    localStorage.setItem('currencyOptions', JSON.stringify(defaultOptions));
    window.location = 'https://poewishlist.xyz/dashboard';
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
          <div>
            <p>Resetting things will probably fix it: </p>
            <button onClick={this.resetItems}>Reset Builds</button>
            <button onClick={this.resetCurrency}>Reset Currency</button>
            <button onClick={this.resetAll}>Reset Everything</button>
          </div>
        </div>
      );
    }
    // Render children if there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;
