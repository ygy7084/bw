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
class StaffModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sn: '',
      name: '',
      location: '',
      level: '',
      barcode_id: '',
      modifyMode: false,
    };
    this.handleModify = this.handleModify.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.staff && JSON.stringify(this.props.staff) !== JSON.stringify(nextProps.staff)) {
      this.setState({
        sn: nextProps.staff.sn,
        name: nextProps.staff.name,
        location: nextProps.staff.location,
        level: nextProps.staff.level,
        barcode_id: nextProps.staff.barcode_id,
        modifyMode: false,
      });
    }
  }
  componentDidUpdate() {
    const qrdom = this.qr;
    if (
      qrdom && qrdom.childNodes.length === 0 &&
      this.props.staff &&
      this.props.staff.barcode_id &&
      this.props.staff.barcode_id !== ''
    ) {
      const qrdom = this.qr;
      const qrcode = new QRCode(qrdom, {
        width: 100,
        height: 100,
      });
      qrcode.makeCode(this.props.staff.barcode_id);
    }
  }
  handleModify() {
    this.props.modify({
      _id: this.props.staff._id,
      sn: this.state.sn,
      name: this.state.name,
      location: this.state.location,
      level: this.state.level,
      barcode_id: this.state.barcode_id,
    });
  }
  handleRemove() {
    this.props.remove({ _id: this.props.staff._id });
  }
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>직원 정보</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsText">
                <ControlLabel>사번</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.sn}
                  disabled={!this.state.modifyMode}
                  onChange={e => this.setState({ sn: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>이름</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.name}
                  disabled={!this.state.modifyMode}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>근무지</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.location}
                  disabled={!this.state.modifyMode}
                  onChange={e => this.setState({ location: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>권한</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={e => this.setState({ level: e.target.value })}
                  value={this.state.level}
                  disabled={!this.state.modifyMode}
                >
                  <option value="직원">직원</option>
                  <option value="관리자">관리자</option>
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

export default StaffModal;
