import React from 'react';
import {
  Button,
  ControlLabel,
  Form, FormGroup,
  FormControl,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from 'react-bootstrap';

class WorkInsertModal extends React.Component {
  static calculateWorkingHours(start, end) {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
  constructor(props) {
    super(props);
    this.state = {
      datetime: new Date(),
      endDatetime: new Date(),
      workingHours: 0,
    };
    this.clear = this.clear.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleDatetimeInput = this.handleDatetimeInput.bind(this);
    this.handleEndDatetimeInput = this.handleEndDatetimeInput.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.clear();
    }
  }
  clear() {
    this.setState({
      datetime: new Date(),
      endDatetime: new Date(),
      workingHours: 0,
    });
  }
  handleDatetimeInput(key, e) {
    const { value } = e.target;
    const numeric = value.replace(/\D/g, '');
    const datetime = this.state.datetime;
    switch (key) {
      case 'year' :
        datetime.setFullYear(numeric);
        break;
      case 'month':
        datetime.setMonth(parseInt(numeric, 10) - 1);
        break;
      case 'date':
        datetime.setDate(numeric);
        break;
      case 'hour':
        datetime.setHours(numeric);
        break;
      case 'minute':
        datetime.setMinutes(numeric);
        break;
      default:
    }
    this.setState({
      datetime,
      endDatetime: new Date(datetime),
      workingHours: 0,
    });
  }
  handleEndDatetimeInput(key, e) {
    const { value } = e.target;
    const numeric = value.replace(/\D/g, '');
    let endDatetime = this.state.endDatetime;
    switch (key) {
      case 'date' :
        endDatetime.setDate(numeric);
        break;
      case 'hour' :
        endDatetime.setHours(numeric);
        break;
      case 'minute':
        endDatetime.setMinutes(numeric);
        break;
      default:
    }
    let workingHours = WorkInsertModal.calculateWorkingHours(this.state.datetime, endDatetime);
    if (workingHours < 0) {
      workingHours = 0;
    }
    this.setState({
      endDatetime,
      workingHours,
    });
  }
  handleInsert() {
    this.props.insert({
      staff: this.props.staff ? this.props.staff._id : null,
      datetimeYear: this.state.datetime.getFullYear(),
      datetimeMonth: this.state.datetime.getMonth() + 1,
      datetimeDate: this.state.datetime.getDate(),
      datetimeHour: this.state.datetime.getHours(),
      datetimeMinute: this.state.datetime.getMinutes(),
      endDatetimeYear: this.state.endDatetime.getFullYear(),
      endDatetimeMonth: this.state.endDatetime.getMonth() + 1,
      endDatetimeDate: this.state.endDatetime.getDate(),
      endDatetimeHour: this.state.endDatetime.getHours(),
      endDatetimeMinute: this.state.endDatetime.getMinutes(),
      workingHours: this.state.workingHours,
    });
  }
  render() {
    if (!this.props.staff) {
      return null;
    }
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>근무 추가</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsName">
                <ControlLabel>사번</ControlLabel>
                <FormControl
                  type="text"
                  value={this.props.staff ? this.props.staff.sn : '삭제됨'}
                  disabled
                />
              </FormGroup>
              <FormGroup controlId="formControlsName">
                <ControlLabel>이름</ControlLabel>
                <FormControl
                  type="text"
                  value={this.props.staff ? this.props.staff.name : '삭제됨'}
                  disabled
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>근무 연도(Year)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.datetime.getFullYear()}
                  onChange={e => this.handleDatetimeInput('year', e)}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>근무 월(Month)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.datetime.getMonth() + 1}
                  onChange={e => this.handleDatetimeInput('month', e)}
                />
              </FormGroup>
              <FormGroup controlId="formControlsYear">
                <ControlLabel>근무 일(Date)(</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.datetime.getDate()}
                  onChange={e => this.handleDatetimeInput('date', e)}
                />
              </FormGroup>
              <div>
                <Row>
                  <Col md={6}>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 시작 일(Date)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.datetime.getDate()}
                        disabled
                      />
                    </FormGroup>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 시작 시간(Hour)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.datetime.getHours()}
                        onChange={e => this.handleDatetimeInput('hour', e)}
                      />
                    </FormGroup>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 시작 분(Minute)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.datetime.getMinutes()}
                        onChange={e => this.handleDatetimeInput('minute', e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 마감 일(Date)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.endDatetime.getDate()}
                        onChange={e => this.handleEndDatetimeInput('date', e)}
                      />
                    </FormGroup>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 마감 시간(Hour)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.endDatetime.getHours()}
                        onChange={e => this.handleEndDatetimeInput('hour', e)}
                      />
                    </FormGroup>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 마감 분(Minute)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.endDatetime.getMinutes()}
                        onChange={e => this.handleEndDatetimeInput('minute', e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup controlId="formControlsHour">
                  <ControlLabel>근무 시간</ControlLabel>
                  <FormControl
                    type="number"
                    value={this.state.workingHours}
                    disabled
                  />
                </FormGroup>
              </div>
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


export default WorkInsertModal;
