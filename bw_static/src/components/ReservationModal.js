import React from 'react';
import { Button, Alert, ButtonGroup, Modal } from 'react-bootstrap';

const styles = {
  alert: {
    marginBottom: '0px',
  },
  buttons: {
    textAlign: 'right',
  },
};
const ReservationModal = function ReservationModal(props) {
  return (
    <div>
      <Modal
        show={props.toggle}
      >
        <Alert bsStyle="danger" style={styles.alert}>
          <h3>예매 내역을 삭제합니다.</h3>
          <p>예매 내역이 삭제되면 예매한 고객의 예매 내역이 지워집니다.</p>
          <div style={styles.buttons}>
            <ButtonGroup>
              <Button bsSize="large" bsStyle="danger" onClick={props.handleRemove}>삭제</Button>
              <Button bsSize="large" onClick={props.close}>닫기</Button>
            </ButtonGroup>
          </div>
        </Alert>
      </Modal>
    </div>
  );
};

export default ReservationModal;
