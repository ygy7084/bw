import React from 'react';
import { Button, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

const styles = {
  buttons: {
    display: 'inline-block',
    marginRight: '10px', },
};
class BusModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      year: '',
      month: '',
      date: '',
      hour: '',
      minute: '',
      modifyMode: false,
    };
    this.handleModify = this.handleModify.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleYearInput = this.handleYearInput.bind(this);
    this.handleMonthInput = this.handleMonthInput.bind(this);
    this.handleDateInput = this.handleDateInput.bind(this);
    this.handleHourInput = this.handleHourInput.bind(this);
    this.handleMinuteInput = this.handleMinuteInput.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.bus && nextProps.bus.datetime && JSON.stringify(this.props.bus) !== JSON.stringify(nextProps.bus)) {
      const date = nextProps.bus.datetime;
      this.setState({
        number: nextProps.bus.number,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        modifyMode: false,
      });
    }
  }
  handleModify() {
    this.props.modify({
      _id: this.props.bus._id,
      number: this.state.number,
      year: this.state.year,
      month: this.state.month,
      date: this.state.date,
      hour: this.state.hour,
      minute: this.state.minute,
    });
  }
  handleRemove() {
    this.props.remove({ _id: this.props.bus._id });
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
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>버스 정보</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsNumber">
                <ControlLabel>번호</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.number}
                  onChange={e => this.setState({ number: e.target.value })}
                  disabled={!this.state.modifyMode}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>출경 연도(Year)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.year}
                  onChange={this.handleYearInput}
                  disabled={!this.state.modifyMode}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>출경 월(Month)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.month}
                  onChange={this.handleMonthInput}
                  disabled={!this.state.modifyMode}
                />
              </FormGroup>
              <FormGroup controlId="formControlsYear">
                <ControlLabel>출경 일(Date)(</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.date}
                  onChange={this.handleDateInput}
                  disabled={!this.state.modifyMode}
                />
              </FormGroup>
              <FormGroup controlId="formControlsHour">
                <ControlLabel>출경 시간(Hour)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.hour}
                  onChange={this.handleHourInput}
                  disabled={!this.state.modifyMode}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMinute">
                <ControlLabel>출경 분(Minute)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.minute}
                  onChange={this.handleMinuteInput}
                  disabled={!this.state.modifyMode}
                />
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


export default BusModal;
