import React, { Component } from 'react';
import { List } from 'react-virtualized';

const SearchList = props => {
  const rows = props.children;
  const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => (
    <div key={key} style={style}>
      {rows[index]}
    </div>
  );

  return (
    <List
      style={{ width: '100%' }}
      width={'100%'}
      height={200}
      rowHeight={30}
      rowCount={rows.length}
      rowRenderer={rowRenderer}
    />
  );
};

export default SearchList;
