/* global QRCode */
import React from 'react';
import { Button, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

const styles = {
  barcode: {
    width: '100px',
    height: '100px',
    marginTop: '15px',
  },
  buttons: {
    display: 'inline-block',
    marginRight: '10px',
  },
};
class CustomerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      bus: -1,
      enteringBus: -1,
      outgoingBus: -1,
      state: '',
      barcode_id: '',
      modifyMode: false,
    };
    this.handleModify = this.handleModify.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.customer && JSON.stringify(this.props.customer) !== JSON.stringify(nextProps.customer)) {
      this.setState({
        name: nextProps.customer.name,
        phone: nextProps.customer.phone,
        bus: nextProps.customer.bus,
        enteringBus: nextProps.customer.enteringBus,
        outgoingBus: nextProps.customer.outgoingBus,
        state: nextProps.customer.state,
        barcode_id: nextProps.customer.barcode_id,
        modifyMode: false,
      });
    }
  }
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
  handleModify() {
    this.props.modify({
      _id: this.props.customer._id,
      name: this.state.name,
      phone: this.state.phone,
      bus: this.state.bus,
      enteringBus: this.state.enteringBus,
      outgoingBus: this.state.outgoingBus,
      state: this.state.state,
      barcode_id: this.state.barcode_id,
    });
  }
  handleRemove() {
    this.props.remove({ _id: this.props.customer._id });
  }
  handleChangeState(e) {
    this.setState({
      state: e.target.value,
    });
  }
  render() {
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
                  value={this.state.name}
                  disabled={!this.state.modifyMode}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText2">
                <ControlLabel>전화번호</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.phone}
                  disabled={!this.state.modifyMode}
                  onChange={e => this.setState({ phone: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText3">
                <ControlLabel>지정 버스</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={e => this.setState({ bus: e.target.value })}
                  value={this.state.bus}
                  disabled={!this.state.modifyMode}
                >
                  <option value={-1}>버스 선택</option>
                  {
                    this.props.busList.map(bus =>
                      <option key={bus.number} value={bus.number}>{bus.number}</option>,
                    )
                  }
                </FormControl>
              </FormGroup>
              <FormGroup controlId="formControlsText3">
                <ControlLabel>입경 버스</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={e => this.setState({ enteringBus: e.target.value })}
                  value={this.state.enteringBus}
                  disabled={!this.state.modifyMode}
                >
                  <option value={-1}>미탑승</option>
                  {
                    this.props.busList.map(bus =>
                      <option key={bus.number} value={bus.number}>{bus.number}</option>,
                    )
                  }
                </FormControl>
              </FormGroup>
              <FormGroup controlId="formControlsText3">
                <ControlLabel>출경 버스</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={e => this.setState({ outgoingBus: e.target.value })}
                  value={this.state.outgoingBus}
                  disabled={!this.state.modifyMode}
                >
                  <option value={-1}>미탑승</option>
                  {
                    this.props.busList.map(bus =>
                      <option key={bus.number} value={bus.number}>{bus.number}</option>,
                    )
                  }
                </FormControl>
              </FormGroup>
              <FormGroup controlId="formControlsText4">
                <ControlLabel>상태</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={this.handleChangeState}
                  value={this.state.state}
                  disabled={!this.state.modifyMode}
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
                  value={this.state.barcode_id}
                  disabled={!this.state.modifyMode}
                  onChange={e => this.setState({ barcode_id: e.target.value })}
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
            {
              this.state.modifyMode === false ?
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  onClick={() => this.setState({ modifyMode: true })}
                >수정 또는 삭제</Button> :
                <div style={styles.buttons}>
                  <Button
                    bsStyle="info"
                    bsSize="large"
                    onClick={this.handleModify}
                  >수정</Button>
                  <Button
                    bsStyle="warning"
                    bsSize="large"
                    onClick={this.handleRemove}
                  >삭제</Button>
                </div>
            }
            <Button bsSize="large" onClick={this.props.close}>닫기</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default CustomerModal;
