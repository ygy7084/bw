import React from 'react';
import { Button, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

class StaffInsertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sn: '',
      name: '',
      location: '',
      level: '',
      barcode_id: '',
    };
    this.clear = this.clear.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.clear();
    }
  }
  clear() {
    this.setState({
      sn: '',
      name: '',
      location: '',
      level: '직원',
      barcode_id: '',
    });
  }
  handleInsert() {
    this.props.insert(this.state);
  }
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>직원 추가</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsText">
                <ControlLabel>사번 (없을 시 자동 생성)</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.sn}
                  onChange={e => this.setState({ sn: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>이름</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>근무지</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.location}
                  onChange={e => this.setState({ location: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>권한</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={e => this.setState({ level: e.target.value })}
                  value={this.state.level}
                >
                  <option value="직원">직원</option>
                  <option value="관리자">관리자</option>
                </FormControl>
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>바코드 ID (없을 시 자동 생성)</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.barcode_id}
                  onChange={e => this.setState({ barcode_id: e.target.value })}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              bsStyle="success"
              bsSize="large"
              onClick={this.handleInsert}
            >추가</Button>
            <Button
              bsSize="large"
              onClick={() => {
                this.props.close();
                this.clear();
              }}
            >닫기</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default StaffInsertModal;
