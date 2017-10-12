/* global window */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  customer,
  bus,
} from '../actions';

import {
  ErrorModal,
  BarcodeScanner,
  BarcodeMode,
  BarcodeModal,
} from '../components';
import barcode from './webqr';

import {
  loader,
} from '../modules';

class Barcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: null,
      modeSelectedBus: '',
      modeText: '기능을 선택해주십시요.',
      bus: 1,
      barcodeModalToggle: false,
      barcodeState: null,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.errorHandle = this.errorHandle.bind(this);
    this.activateBarcodeReader = this.activateBarcodeReader.bind(this);
    this.activateBarcodeReaderAgain = this.activateBarcodeReaderAgain.bind(this);
    this.customerFind = this.customerFind.bind(this);
    this.customerModify = this.customerModify.bind(this);
    this.modeSelect = this.modeSelect.bind(this);
  }
  componentDidMount() {
    this.activateBarcodeReader(() => {}, '대기');
    loader.on();
    this.props.busGetListRequest()
      .then((data) => {
        if (this.props.busGetList.status === 'SUCCESS') {
          loader.off();
        } else if (this.props.busGetList.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
    // Bus Load End
  }
  componentWillUnmount() {
    this.activateBarcodeReader(null, null);
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
      this.customerFind(barcode_id);
    }, state);
  }
  customerFind(barcode_id) {
    this.props.customerGetRequest(barcode_id)
      .then((data) => {
        if (this.props.customerGet.status === 'SUCCESS') {
          this.activateBarcodeReader(null, '촬영 완료');
          window.scrollTo(0, 1000);
        } else if (this.props.customerGet.status === 'FAILURE') {
          throw data;
        }
      })
      .catch(() => {
        this.activateBarcodeReaderAgain('인식 오류 - 재촬영 중');
      });
  }
  customerModify(customer) {
    loader.on();
    const customer_t = customer;
    switch (this.state.mode) {
      case '출경탑승' :
        customer_t.outgoingBus = this.state.bus;    // 고객 DB의 bus 필드는 변하지 않고 History 생성을 위한 것이다.
        customer_t.state = this.state.mode;
        break;
      case '입경탑승' :
        customer_t.enteringBus = this.state.bus;    // 고객 DB의 bus 필드는 변하지 않고 History 생성을 위한 것이다.
        customer_t.state = this.state.mode;
        break;
      case '미교부' :
      case '교부' :
      case '입경' :
      case '출경' :
        customer_t.state = this.state.mode;
        break;
      default:
    }
    this.props.customerModifyRequest(customer_t, this.props.staffSession.staff)
      .then((data) => {
      console.log(data);
        if (this.props.customerModify.status === 'SUCCESS') {
          this.activateBarcodeReader(barcode_id => {
            this.customerFind(barcode_id);
          }, '촬영 중');
          loader.off();
        } else if (this.props.customerModify.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  modeSelect(select) {
    if (select.mode === '조회') {
      this.setState({
        mode: select.mode,
        modeText: select.mode,
        barcodeModalToggle: false,
      });
    } else if (select.mode !== '입경탑승' && select.mode !== '출경탑승') {
      this.setState({
        mode: select.mode,
        modeText: `${select.mode}(으)로 상태 변경`,
        barcodeModalToggle: false,
      });
    } else {
      this.setState({
        mode: select.mode,
        modeSelectedBus: select.bus,
        modeText: `${select.bus}번 차량 ${select.mode}`,
        barcodeModalToggle: false,
        bus: select.bus,
      });
    }
    this.activateBarcodeReader(barcode_id => {
      this.customerFind(barcode_id);
    }, '촬영 중');
  }
  render() {
    return (
      <div>
        <BarcodeScanner />
        <BarcodeMode
          click={() => this.setState({ barcodeModalToggle: true })}
          mode={this.state.mode}
          modeSelectedBus={this.state.modeSelectedBus}
          modeText={this.state.modeText}
          barcodeState={this.state.barcodeState}
          customer={this.props.customerGet.customer}
          reactivate={() => this.activateBarcodeReaderAgain('촬영 중')}
          bus={this.state.bus}
          modify={this.customerModify}
        />
        <BarcodeModal
          mode={this.state.mode}
          bus={this.props.busGetList.list.map(bus => bus.number)}
          toggle={this.state.barcodeModalToggle}
          close={() => this.setState({ barcodeModalToggle: false })}
          select={state => this.modeSelect(state)}
        />
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
  busGetList: {
    status: state.bus.getList.status,
    list: state.bus.getList.list,
  },
  staffSession: {
    status: state.staff.session.status,
    staff: state.staff.session.staff,
  },
  customerGet: {
    status: state.customer.get.status,
    customer: state.customer.get.customer,
  },
  customerModify: {
    status: state.customer.modify.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  customerGetRequest: customer.getRequest,
  customerModifyRequest: customer.modifyRequest,
  busGetListRequest: bus.getListRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Barcode);
