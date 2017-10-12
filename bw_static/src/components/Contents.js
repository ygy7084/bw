import React from 'react';
import Radium from 'radium';

const style = {
  Contents: {
    base: {
      paddingLeft: '220px',
      paddingRight: '20px',
      paddingTop: '75px',
    },
    wide: {
      paddingLeft: '20px',
    },
    barcode: {
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '35px',
    },
  },
};
const Contents = (props) => {
  const contentsStyle = [style.Contents.base];
  if (props.menuClose) {
    contentsStyle.push(style.Contents.wide);
  }
  if (props.barcode) {
    contentsStyle.push(style.Contents.barcode);
  }
  return (
    <div style={contentsStyle}>
      {props.children}
    </div>
  );
};

export default Radium(Contents);
