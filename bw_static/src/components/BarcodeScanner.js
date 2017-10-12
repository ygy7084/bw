import React from 'react';

const styles = {
  video: {
    maxHeight: '400px',
    width: '100%',
  },
  canvas: {
    display: 'none',
  },
};
const BarcodeScanner = function BarcodeScanner() {
  return (
    <div>
      <video id="v" autoPlay style={styles.video} />
      <canvas id="qr-canvas" width="800" height="600" style={styles.canvas} />
    </div>
  );
};

export default BarcodeScanner;
