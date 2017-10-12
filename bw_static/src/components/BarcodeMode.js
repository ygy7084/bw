import React from 'react';
import { Button } from 'react-bootstrap';

const styles = {
  funcButton: {
    maxWidth: '533',
    margin: '-6px auto 0px',
    borderRadius: '0',
    fontSize: '2rem',
  },
  reactivateButton: {
    maxWidth: '533',
    margin: '0px auto',
    borderRadius: '0',
    fontSize: '2rem',
  },
};
const BarcodeMode = function BarcodeMode(props) {
  let stateChangeStyle = 'success';
  if (props.customer && (props.mode === '입경탑승' || props.mode === '출경탑승') &&
    parseInt(props.customer.bus, 10) !== parseInt(props.modeSelectedBus, 10)) {
    stateChangeStyle = 'danger';
  }
  return (
    <div>
      <Button
        bsStyle="primary"
        bsSize="large"
        style={styles.funcButton}
        block
        onClick={props.click}
      >{props.modeText}</Button>

      {props.customer && props.barcodeState === '촬영 완료' ?
        <Button
          bsStyle="info"
          bsSize="large"
          style={styles.reactivateButton}
          block
          onClick={props.reactivate}
        >
          재촬영</Button>
        : null
      }
      <div style={{ textAlign: 'center' }}>
        <h4>{props.barcodeState}</h4>
      </div>
      {props.customer && props.barcodeState === '촬영 완료' ?
        <div style={{ textAlign: 'center' }}>
          <h3>이름: <b>{props.customer.name}</b></h3>
          <h3>전화번호:<b> {props.customer.phone}</b></h3>
          <h3>탑승버스:<b> {props.customer.bus}</b></h3>
          <h3>상태: <b>{props.customer.state}</b></h3>
        </div>
        : null
      }
      {props.customer && props.barcodeState === '촬영 완료' && props.mode !== '조회' ?
        <div>
          {stateChangeStyle === 'danger' ? <h4 style={{ textAlign: 'center', color: 'red' }}>다른 버스 탑승 고객</h4> : null}
          <Button
            bsStyle={stateChangeStyle}
            bsSize="large"
            style={styles.reactivateButton}
            block
            onClick={() => props.modify(props.customer)}
          >
            상태 변경({props.mode})</Button>
        </div>
        : null
      }
    </div>
  );
};

export default BarcodeMode;
