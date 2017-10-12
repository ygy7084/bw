import React from 'react';
import { Button, HelpBlock, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

class CustomerInsertModal extends React.Component {
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
    };
    this.clear = this.clear.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleExcelInput = this.handleExcelInput.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.clear();
    }
  }
  clear() {
    this.setState({
      name: '',
      phone: '',
      bus: -1,
      enteringBus: -1,
      outgoingBus: -1,
      state: '미교부',
      barcode_id: '',
    });
  }
  handleInsert() {
    const customer = {};
    for (const prop in this.state) {
      if (this.state[prop] && this.state[prop] !== '') {
        customer[prop] = this.state[prop];
      }
    }
    this.props.insert(customer);
  }
  handleChangeState(e) {
    this.setState({
      state: e.target.value,
    });
  }
  handleExcelInput(e) {
    this.props.customerExcel(e.target.files[0]);
  }
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>고객 추가</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsText">
                <ControlLabel>이름</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>전화번호</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.phone}
                  onChange={e => this.setState({ phone: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText3">
                <ControlLabel>지정 버스</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={e => this.setState({ bus: e.target.value })}
                  value={this.state.bus}
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
                >
                  <option value={-1}>미탑승</option>
                  {
                    this.props.busList.map(bus =>
                      <option key={bus.number} value={bus.number}>{bus.number}</option>,
                    )
                  }
                </FormControl>
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>상태</ControlLabel>
                <FormControl
                  componentClass="select"
                  onChange={this.handleChangeState}
                  value={this.state.state}
                >
                  <option value="미교부">미교부</option>
                  <option value="교부">교부</option>
                  <option value="입경탑승">입경탑승</option>
                  <option value="입경">입경</option>
                  <option value="출경탑승">출경탑승</option>
                  <option value="출경">출경</option>
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
              <hr />
              <FormGroup>
                <ControlLabel>엑셀 입력</ControlLabel>
                <HelpBlock>엑셀을 업로드하세요. 형식에 주의하십시요.</HelpBlock>
                <FormControl
                  type="file"
                  label="File"
                  onChange={this.handleExcelInput}
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
                this.clear();}}
            >닫기</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default CustomerInsertModal;
