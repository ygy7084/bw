/* global QRCode */
import React from 'react';
import { Button, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
const styles = {
  barcode: {
    width: '100px',
    height: '100px',
    marginTop: '15px',
  },
};
class RealtimeModal extends React.Component {
  componentDidUpdate() {
    const qrdom = this.qr;
    if (qrdom && qrdom.childNodes.length === 0 && this.props.customer && this.props.customer.barcode_id && this.props.customer.barcode_id !== '') {
      const qrdom = this.qr;
      const qrcode = new QRCode(qrdom, {
        width: 100,
        height: 100,
      });
      qrcode.makeCode(this.props.customer.barcode_id);
    }
  }
  render() {
    if (!this.props.customer) {
      return null;
    }
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>고객 정보</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsText1">
                <ControlLabel>이름</ControlLabel>
                <FormControl
                  type="text"
                  value={this.props.customer.name}
                  disabled
                />
              </FormGroup>
              <FormGroup controlId="formControlsText2">
                <ControlLabel>전화번호</ControlLabel>
                <FormControl
                  type="text"
                  value={this.props.customer.phone}
                  disabled
                />
              </FormGroup>
              <FormGroup controlId="formControlsText3">
                <ControlLabel>버스</ControlLabel>
                <FormControl
                  type="number"
                  value={this.props.customer.bus === -1 ? '' : this.props.customer.bus}
                  disabled
                />
              </FormGroup>
              <FormGroup controlId="formControlsText4">
                <ControlLabel>상태</ControlLabel>
                <FormControl
                  componentClass="select"
                  value={this.props.customer.state}
                  disabled
                >
                  <option value="미교부">미교부</option>
                  <option value="교부">교부</option>
                  <option value="입경탑승">입경탑승</option>
                  <option value="입경">입경</option>
                  <option value="출경탑승">출경탑승</option>
                  <option value="출경">출경</option>
                </FormControl>
              </FormGroup>
              <FormGroup controlId="formControlsText5">
                <ControlLabel>바코드 ID</ControlLabel>
                <FormControl
                  type="text"
                  value={this.props.customer.barcode_id}
                  disabled
                />
              </FormGroup>
              <FormGroup controlId="formControlsText6">
                <ControlLabel>바코드</ControlLabel>
                <div>
                  <div ref={(div) => { this.qr = div; }} style={styles.barcode} />
                </div>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button bsSize="large" onClick={this.props.close}>닫기</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default RealtimeModal;
