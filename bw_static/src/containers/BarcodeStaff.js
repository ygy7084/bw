/* global window */
import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  staff,
  work,
} from '../actions';

import {
  BarcodeModeForStaff,
  BarcodeModalForStaff,
  BarcodeScanner,
  ErrorModal,
} from '../components';
import barcode from './webqr';
import {
  loader,
} from '../modules';

let interval;
class BarcodeStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: null,
      datetime: new Date(),
      foundStaff: null,
      barcodeState: null,
      modeText: '기능을 선택해주십시요.',
      barcodeModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.errorHandle = this.errorHandle.bind(this);
    this.workLoad = this.workLoad.bind(this);
    this.initialize = this.initialize.bind(this);
    this.activateBarcodeReader = this.activateBarcodeReader.bind(this);
    this.activateBarcodeReaderAgain = this.activateBarcodeReaderAgain.bind(this);
    this.workInsert = this.workInsert.bind(this);
    this.modeSelect = this.modeSelect.bind(this);
    this.workModify = this.workModify.bind(this);
  }
  workLoad() {
    loader.on();
    this.props.workGetListRequest()
      .then((data) => {
        if (this.props.workGetList.status === 'SUCCESS') {
          loader.off();
        } else if (this.props.workGetList.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  componentDidMount() {
    interval = setInterval(() => { this.setState({ datetime: new Date() }); }, 1000);
    this.activateBarcodeReader(() => {}, '대기');
    this.workLoad();
  }
  componentWillUnmount() {
    clearInterval(interval);
    this.activateBarcodeReader(null, null);
  }
  initialize() {
    this.activateBarcodeReader(null, null);
    this.setState({
      foundStaff: null,
      barcodeState: null,
      errorMessage: '',
      errorModalToggle: false,
    });
    this.staffLoad();
  }
  activateBarcodeReader(cb, state) {
    /*
    barcode(null)은 바코드 리더를 종료시킨다.
    이 코드는 종료 시킨 후 다시 실행하는 코드이다.
     */
    barcode(null);
    if (cb) {
      loader.on();
      setTimeout(() => {
        barcode(cb);
        loader.off();
        this.setState({ barcodeState: state });
      }, 400);
    } else if (state) {
      this.setState({ barcodeState: state });
    } else {
      this.setState({ barcodeState: '대기' });
    }
  }
  activateBarcodeReaderAgain(state) {
    this.activateBarcodeReader(barcode_id => {
      this.staffFind(barcode_id);
    }, state);
  }
  staffFind(barcode_id) {
    this.props.staffGetRequest(barcode_id)
      .then((data) => {
        if (this.props.staffGet.status === 'SUCCESS') {
          this.activateBarcodeReader(null, '촬영 완료');
          window.scrollTo(0, 1000);
        } else if (this.props.staffGet.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((e) => {
        console.log(e);
        this.activateBarcodeReaderAgain('인식 오류 - 재촬영 중');
      });
  }
  errorHandle(data) {
    const error = data.error || data;
    if (error.message && error.message !== '') {
      const message = error.message;
      this.setState({
        errorMessage: message,
        errorModalToggle: true,
      });
      throw error.error;
    } else {
      this.setState({
        errorModalToggle: true,
      });
      throw error;
    }
  }
  workInsert() {
    loader.on();
    this.props.workInsertRequest({
      staff: this.props.staffGet.staff._id,
      datetimeYear: this.state.datetime.getFullYear(),
      datetimeMonth: this.state.datetime.getMonth() + 1,
      datetimeDate: this.state.datetime.getDate(),
      datetimeHour: this.state.datetime.getHours(),
      datetimeMinute: this.state.datetime.getMinutes(),
      endDatetimeYear: this.state.datetime.getFullYear(),
      endDatetimeMonth: this.state.datetime.getMonth() + 1,
      endDatetimeDate: this.state.datetime.getDate(),
      endDatetimeHour: this.state.datetime.getHours(),
      endDatetimeMinute: this.state.datetime.getMinutes(),
      workingHours: 0,
    })
      .then((data) => {
        if (this.props.workInsert.status === 'SUCCESS') {
          this.workLoad();
          this.activateBarcodeReader(barcode_id => {
            this.staffFind(barcode_id);
          }, '촬영 중');
          loader.off();
        } else if (this.props.workInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((e) => {
        if (e.error && e.error.message) {
          loader.off();
          this.errorHandle(e.error);
        } else {
          console.log(e);
          this.activateBarcodeReaderAgain('인식 오류 - 재촬영 중');
        }
      });
  }
  workModify() {
    loader.on();
    const staff = this.props.staffGet.staff;
    const found = this.props.workGetList.list.find((work) => {
      const tempDatetime = new Date(this.state.datetime);
      tempDatetime.setHours(0);
      tempDatetime.setMinutes(0);
      tempDatetime.setSeconds(0, 0);
      return tempDatetime.getTime() === work.dateID && staff._id === work.staff._id && !work.workingHours && work.workingHours !== '';
    });
    if (!found) {
      loader.off();
      this.errorHandle({ message: '출근 기록이 없거나 이미 퇴근을 기록했습니다.' });
    } else {
      found.datetime = new Date(found.datetime);
      this.props.workModifyRequest({
        _id: found._id,
        datetimeYear: found.datetime.getFullYear(),
        datetimeMonth: found.datetime.getMonth() + 1,
        datetimeDate: found.datetime.getDate(),
        datetimeHour: found.datetime.getHours(),
        datetimeMinute: found.datetime.getMinutes(),
        endDatetimeYear: this.state.datetime.getFullYear(),
        endDatetimeMonth: this.state.datetime.getMonth() + 1,
        endDatetimeDate: this.state.datetime.getDate(),
        endDatetimeHour: this.state.datetime.getHours(),
        endDatetimeMinute: this.state.datetime.getMinutes(),
        workingHours: (this.state.datetime.getTime() - found.datetime.getTime()) / (1000 * 60 * 60)
      })
        .then((data) => {
          if (this.props.workModify.status === 'SUCCESS') {
            this.workLoad();
            this.activateBarcodeReader(barcode_id => {
              this.staffFind(barcode_id);
            }, '촬영 중');
            loader.off();
          } else if (this.props.workModify.status === 'FAILURE') {
            loader.off();
            throw data;
          }
        })
        .catch((e) => {
          if (e.error && e.error.message) {
            loader.off();
            this.errorHandle(e.error);
          } else {
            console.log(e);
            this.activateBarcodeReaderAgain('인식 오류 - 재촬영 중');
          }
        });
    }
  }
  modeSelect(mode) {
    this.setState({
      mode: mode,
      modeText: mode,
      barcodeModalToggle: false,
    });
    this.activateBarcodeReader(barcode_id => {
      this.staffFind(barcode_id);
    }, '촬영 중');
  }
  render() {
    return (
      <div>
        <div>
          <BarcodeScanner />
          <BarcodeModeForStaff
            click={() => this.setState({ barcodeModalToggle: true })}
            initialize={this.initialize}
            workInsert={this.workInsert}
            workModify={this.workModify}
            mode={this.state.mode}
            modeText={this.state.modeText}
            barcodeState={this.state.barcodeState}
            staff={this.props.staffGet.staff}
            datetime={this.state.datetime}
            reactivate={() => this.activateBarcodeReaderAgain('촬영 중')}
          />
          <BarcodeModalForStaff
            mode={this.state.mode}
            toggle={this.state.barcodeModalToggle}
            close={() => this.setState({ barcodeModalToggle: false })}
            select={mode => this.modeSelect(mode)}
          />
        </div>
        <ErrorModal
          toggle={this.state.errorModalToggle}
          close={() => this.setState({ errorModalToggle: false })}
          message={this.state.errorMessage}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  workGetList: {
    status: state.work.getList.status,
    list: state.work.getList.list,
  },
  workInsert: {
    status: state.work.insert.status,
    work: state.work.insert.work,
  },
  workModify: {
    status: state.work.modify.status,
  },
  staffGet: {
    status: state.staff.get.status,
    staff: state.staff.get.staff,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  staffGetRequest: staff.getRequest,
  workGetListRequest: work.getListRequest,
  workInsertRequest: work.insertRequest,
  workModifyRequest: work.modifyRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BarcodeStaff);
