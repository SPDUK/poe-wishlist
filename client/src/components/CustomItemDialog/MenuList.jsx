import React from 'react';
import { List } from 'react-virtualized';

const MenuList = props => {
  const rows = props.children;
  const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => (
    <div key={key} style={style}>
      {rows[index]}
    </div>
  );

  return (
    <List
      style={{ width: '100%' }}
      width={537}
      height={150}
      rowHeight={35}
      rowCount={props.children.length || 1}
      rowRenderer={rowRenderer}
    />
  );
};

export default MenuList;
