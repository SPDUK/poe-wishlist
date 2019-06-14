import React, { Component } from 'react';

import './itemlinks.css';
import ReactAux from '../../ReactAux/ReactAux';

class ItemLinks extends Component {
  render() {
    const { numLinks } = this.props;
    return (
      <div className="itemlinks">
        <div className="itemlinks-socket" />
        <div className="itemlinks-link-1" />
        <div className="itemlinks-socket" />
        <div className="itemlinks-link-2" />
        <div className="itemlinks-socket" />
        <div className="itemlinks-link-3" />
        <div className="itemlinks-socket" />
        <div className="itemlinks-link-4" />
        <div className="itemlinks-socket" />
        {numLinks > 5 && (
          <ReactAux>
            <div className="itemlinks-link-5" />
            <div className="itemlinks-socket" />
          </ReactAux>
        )}
      </div>
    );
  }
}

export default ItemLinks;
