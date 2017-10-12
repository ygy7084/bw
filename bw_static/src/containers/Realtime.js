import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  customer,
} from '../actions';

import {
  RealtimeList,
  RealtimeModal,
  ErrorModal,
} from '../components';

import {
  loader,
  configure,
} from '../modules';

let socket;
class Realtime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      realtime: false,
      realtimeList: [],
      realtimeModalToggle: false,
      realtimeModalItem: null,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.getCustomerList = this.getCustomerList.bind(this);
    this.errorHandle = this.errorHandle.bind(this);
    this.customerClick = this.customerClick.bind(this);
  }
  getCustomerList() {
    loader.on();
    this.props.customerGetListRequest()
      .then((data) => {
        if (this.props.customerGetList.status === 'SUCCESS') {
          loader.off();
          this.setState({ realtimeList: this.props.customerGetList.list });
        } else if (this.props.customerGetList.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  componentWillMount() {
    socket = io(configure.url, { secure: true });
    socket.on('connect', () => {
      this.setState({ realtime: true });
      socket.on('customerUpdate', customer => {
        const list = JSON.parse(JSON.stringify(this.state.realtimeList));
        const found = list.find(obj => obj._id === customer._id);
        const props = ['name', 'phone', 'barcode_id', 'bus', 'enteringBus', 'outgoingBus', 'state'];
        if (found) {
          for (let i = 0; i < props.length; i += 1) {
            if (Object.prototype.hasOwnProperty.call(customer, props[i])) {
              found[props[i]] = customer[props[i]];
            }
          }
          this.setState({ realtimeList: list, realtimeModalItem: found });
        }
      });
      socket.on('customerCreate', () => {
        this.getCustomerList();
      });
      socket.on('customerDelete', () => {
        this.getCustomerList();
      });
    });
    socket.on('disconnect', () => {
      this.setState({ realtime: false });
    });
    this.getCustomerList();
  }
  componentWillUnmount() {
    socket.disconnect(true);
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
  customerClick(customer) {
    this.setState({
      realtimeModalToggle: true,
      realtimeModalItem: customer,
    });
  }
  render() {
    return (
      <div>
        <RealtimeList
          customerClick={this.customerClick}
          list={this.state.realtimeList}
          realtime={this.state.realtime}
        />
        <RealtimeModal
          toggle={this.state.realtimeModalToggle}
          close={() => this.setState({ realtimeModalItem: null, realtimeModalToggle: false })}
          customer={this.state.realtimeModalItem ? this.state.realtimeModalItem : null}
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
  customerGetList: {
    status: state.customer.getList.status,
    list: state.customer.getList.list,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  customerGetListRequest: customer.getListRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Realtime);
