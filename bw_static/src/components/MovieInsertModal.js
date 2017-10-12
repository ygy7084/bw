import React from 'react';
import { HelpBlock, Button, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

class MovieInsertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      theater: '',
      available: '',
      year: new Date().getFullYear(),
      month: '',
      date: '',
      hour: '',
      minute: '',
    };
    this.clear = this.clear.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleExcelInput = this.handleExcelInput.bind(this);
    this.handleYearInput = this.handleYearInput.bind(this);
    this.handleMonthInput = this.handleMonthInput.bind(this);
    this.handleDateInput = this.handleDateInput.bind(this);
    this.handleHourInput = this.handleHourInput.bind(this);
    this.handleMinuteInput = this.handleMinuteInput.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.clear();
    }
  }
  clear() {
    this.setState({
      name: '',
      theater: '',
      available: '',
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
    const movie = {};
    for (const prop in this.state) {
      if (this.state[prop] && this.state[prop] !== '') {
        movie[prop] = this.state[prop];
      }
    }
    this.props.insert(movie);
  }
  handleExcelInput(e) {
    this.props.movieExcel(e.target.files[0]);
  }
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>영화 추가</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsName">
                <ControlLabel>제목</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsTheater">
                <ControlLabel>영화관</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.theater}
                  onChange={e => this.setState({ theater: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsAvailable">
                <ControlLabel>총 좌석</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.available}
                  onChange={e => this.setState({ available: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>상영 연도(Year)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.year}
                  onChange={this.handleYearInput}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>상영 월(Month)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.month}
                  onChange={this.handleMonthInput}
                />
              </FormGroup>
              <FormGroup controlId="formControlsYear">
                <ControlLabel>상영 일(Date)(</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.date}
                  onChange={this.handleDateInput}
                />
              </FormGroup>
              <FormGroup controlId="formControlsHour">
                <ControlLabel>상영 시간(Hour)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.hour}
                  onChange={this.handleHourInput}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMinute">
                <ControlLabel>상영 분(Minute)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.minute}
                  onChange={this.handleMinuteInput}
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
                this.clear();
              }}
            >닫기</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default MovieInsertModal;
