import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  customer,
  bus,
} from '../actions';

import {
  BusRealtimeList,
  ErrorModal,
} from '../components';

import {
  loader,
  configure,
} from '../modules';

let socket;
class BusRealtime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      realtime: false,
      customerRealtimeList: [],
      errorMessage: '',
      errorModalToggle: false,
    };
  }
  componentWillMount() {
    loader.on();
    // secure -> https
    socket = io(configure.url, { secure: true });
    socket.on('connect', () => {
      this.setState({ realtime: true });
    });
    socket.on('disconnect', () => {
      this.setState({ realtime: false });
    });
    this.props.busGetListRequest()
      .then((data) => {
        if (this.props.busGetList.status === 'SUCCESS') {
          this.props.customerGetListRequest()
            .then((data) => {
              if (this.props.customerGetList.status === 'SUCCESS') {
                loader.off();
                this.setState({ customerRealtimeList: this.props.customerGetList.list });
                socket.on('customerUpdate', customer => {
                  const list = JSON.parse(JSON.stringify(this.state.customerRealtimeList));
                  const found = list.find(obj => obj._id === customer._id);
                  const props = ['name', 'phone', 'barcode_id', 'bus', 'enteringBus', 'outgoingBus', 'state'];
                  if (found) {
                    for (let i = 0; i < props.length; i += 1) {
                      if (Object.prototype.hasOwnProperty.call(customer, props[i])) {
                        found[props[i]] = customer[props[i]];
                      }
                    }
                    this.setState({ customerRealtimeList: list });
                  }
                });
                socket.on('customerCreate', (customer) => {
                  const list = JSON.parse(JSON.stringify(this.state.customerRealtimeList));
                  list.unshift(customer);
                  this.setState({ customerRealtimeList: list });
                });
                socket.on('customerDelete', (customer) => {
                  const list = JSON.parse(JSON.stringify(this.state.customerRealtimeList));
                  list.splice(list.findIndex(item => customer._id === item._id), 1);
                  this.setState({ customerRealtimeList: list });
                });
              } else if (this.props.customerGetList.status === 'FAILURE') {
                throw data;
              }
            })
            .catch((data) => {
              loader.off();
              this.errorHandle(data);
            });

        } else if (this.props.busGetList.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
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
  render() {
    return (
      <div>
        <BusRealtimeList
          realtime={this.state.realtime}
          buses={this.props.busGetList.list}
          customers={this.state.customerRealtimeList}
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
  customerGetList: {
    status: state.customer.getList.status,
    list: state.customer.getList.list,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  customerGetListRequest: customer.getListRequest,
  busGetListRequest: bus.getListRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BusRealtime);
