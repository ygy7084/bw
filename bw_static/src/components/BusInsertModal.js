import React from 'react';
import { Button, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

class BusInsertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      year: new Date().getFullYear(),
      month: '',
      date: '',
      hour: '',
      minute: '',
    };
    this.clear = this.clear.bind(this);
    this.handleYearInput = this.handleYearInput.bind(this);
    this.handleMonthInput = this.handleMonthInput.bind(this);
    this.handleDateInput = this.handleDateInput.bind(this);
    this.handleHourInput = this.handleHourInput.bind(this);
    this.handleMinuteInput = this.handleMinuteInput.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.clear();
    }
  }
  clear() {
    this.setState({
      number: '',
      year: new Date().getFullYear(),
      month: '',
      date: '',
      hour: '',
      minute: '',
    });
  }
  handleYearInput(e) {
    let value = e.target.value;
    if (parseInt(value, 10) < 1) {
      value = '1';
    }
    this.setState({
      year: value,
    });
  }
  handleMonthInput(e) {
    let value = e.target.value;
    if (parseInt(value, 10) > 12) {
      value = '1';
    }
    if (parseInt(value, 10) < 1) {
      value = '1';
    }
    this.setState({
      month: value,
    });
  }
  handleDateInput(e) {
    let value = e.target.value;
    if (parseInt(value, 10) > 32) {
      value = '1';
    }
    if (parseInt(value, 10) < 1) {
      value = '1';
    }
    this.setState({
      date: value,
    });
  }
  handleHourInput(e) {
    let value = e.target.value;
    if (parseInt(value, 10) > 23) {
      value = '0';
    }
    if (parseInt(value, 10) < 0) {
      value = '0';
    }
    this.setState({
      hour: value,
    });
  }
  handleMinuteInput(e) {
    let value = e.target.value;
    if (parseInt(value, 10) > 59) {
      value = '0';
    }
    if (parseInt(value, 10) < 0) {
      value = '0';
    }
    this.setState({
      minute: value,
    });
  }
  handleInsert() {
    const bus = {};
    for (const prop in this.state) {
      if (this.state[prop] && this.state[prop] !== ''){
        bus[prop] = this.state[prop];
      }
    }
    this.props.insert(bus);
  }
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>버스 추가</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsNumber">
                <ControlLabel>번호</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.number}
                  onChange={e => this.setState({ number: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>출경 연도(Year)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.year}
                  onChange={this.handleYearInput}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>출경 월(Month)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.month}
                  onChange={this.handleMonthInput}
                />
              </FormGroup>
              <FormGroup controlId="formControlsYear">
                <ControlLabel>출경 일(Date)(</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.date}
                  onChange={this.handleDateInput}
                />
              </FormGroup>
              <FormGroup controlId="formControlsHour">
                <ControlLabel>출경 시간(Hour)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.hour}
                  onChange={this.handleHourInput}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMinute">
                <ControlLabel>출경 분(Minute)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.minute}
                  onChange={this.handleMinuteInput}
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


export default BusInsertModal;
