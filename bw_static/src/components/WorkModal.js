import React from 'react';
import {
  Button,
  ControlLabel,
  Form,
  FormGroup,
  FormControl,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from 'react-bootstrap';

const styles = {
  buttons: {
    display: 'inline-block',
    marginRight: '10px',
  },
};
class WorkModal extends React.Component {
  static calculateWorkingHours(start, end) {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
  constructor(props) {
    super(props);
    this.state = {
      datetime: new Date(),
      endDatetime: new Date(),
      workingHours: '',
      modifyMode: false,
    };
    this.handleDatetimeInput = this.handleDatetimeInput.bind(this);
    this.handleEndDatetimeInput = this.handleEndDatetimeInput.bind(this);
    this.handleModify = this.handleModify.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.work && JSON.stringify(this.props.work) !== JSON.stringify(nextProps.work)) {
      this.setState({
        datetime: nextProps.work.datetime,
        endDatetime: nextProps.work.endDatetime,
        workingHours: nextProps.work.workingHours,
        modifyMode: false,
      });
    }
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
    let workingHours = WorkModal.calculateWorkingHours(this.state.datetime, endDatetime);
    if (workingHours < 0) {
      workingHours = 0;
    }
    this.setState({
      endDatetime,
      workingHours,
    });
  }
  handleModify() {
    this.props.modify({
      _id: this.props.work._id,
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
  handleRemove() {
    this.props.remove({ _id: this.props.work._id });
  }
  render() {
    if (!this.props.work) {
      return null;
    }
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>근무 정보</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsName">
                <ControlLabel>사번</ControlLabel>
                <FormControl
                  type="text"
                  value={this.props.work.staff ? this.props.work.staff.sn : '삭제됨'}
                  disabled
                />
              </FormGroup>
              <FormGroup controlId="formControlsTheater">
                <ControlLabel>이름</ControlLabel>
                <FormControl
                  type="text"
                  value={this.props.work.staff ? this.props.work.staff.name : '삭제됨'}
                  disabled
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>근무 연도(Year)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.datetime.getFullYear()}
                  onChange={e => this.handleDatetimeInput('year', e)}
                  disabled={!this.state.modifyMode}
                />
              </FormGroup>
              <FormGroup controlId="formControlsMonth">
                <ControlLabel>근무 월(Month)</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.datetime.getMonth() + 1}
                  onChange={e => this.handleDatetimeInput('month', e)}
                  disabled={!this.state.modifyMode}
                />
              </FormGroup>
              <FormGroup controlId="formControlsYear">
                <ControlLabel>근무 일(Date)(</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.datetime.getDate()}
                  onChange={e => this.handleDatetimeInput('date', e)}
                  disabled={!this.state.modifyMode}
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
                        disabled={!this.state.modifyMode}
                      />
                    </FormGroup>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 시작 분(Minute)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.datetime.getMinutes()}
                        onChange={e => this.handleDatetimeInput('minute', e)}
                        disabled={!this.state.modifyMode}
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
                        disabled={!this.state.modifyMode}
                      />
                    </FormGroup>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 마감 시간(Hour)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.endDatetime.getHours()}
                        onChange={e => this.handleEndDatetimeInput('hour', e)}
                        disabled={!this.state.modifyMode}
                      />
                    </FormGroup>
                    <FormGroup controlId="formControlsHour">
                      <ControlLabel>근무 마감 분(Minute)</ControlLabel>
                      <FormControl
                        type="number"
                        value={this.state.endDatetime.getMinutes()}
                        onChange={e => this.handleEndDatetimeInput('minute', e)}
                        disabled={!this.state.modifyMode}
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


export default WorkModal;
