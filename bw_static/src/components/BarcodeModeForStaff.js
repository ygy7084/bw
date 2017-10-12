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
const BarcodeModeForStaff = function BarcodeModeForStaff(props) {
  return (
    <div>
      <Button
        bsStyle="primary"
        bsSize="large"
        style={styles.funcButton}
        block
        onClick={props.click}
      >{props.modeText}</Button>

      {props.staff && props.barcodeState === '촬영 완료' ?
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
      <div style={{ textAlign: 'center' }}>
        <h4>{props.datetime.toLocaleString()}</h4>
      </div>
      {props.staff && props.barcodeState === '촬영 완료' ?
        <div style={{ textAlign: 'center' }}>
          <h3>사번: <b>{props.staff.sn}</b></h3>
          <h3>이름:<b> {props.staff.name}</b></h3>
        </div>
        : null
      }
      {props.staff && props.barcodeState === '촬영 완료' && props.mode !== '조회' ?
        <div>
          <Button
            bsStyle="primary"
            bsSize="large"
            style={styles.reactivateButton}
            block
            onClick={() => props.mode === '출근' ? props.workInsert() : props.workModify()}
          >
            {props.mode}</Button>
        </div>
        : null
      }
    </div>
  );
};

export default BarcodeModeForStaff;
