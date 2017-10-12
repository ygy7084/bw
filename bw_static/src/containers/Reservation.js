import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  reservation,
} from '../actions';

import {
  ReservationList,
  ReservationModal,
  RemoveModal,
  ErrorModal,
} from '../components';

import {
  loader,
  configure,
} from '../modules';

let socket;
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      realtime: false,
      reservationList: [],
      reservationModalToggle: false,
      reservationModalItem: null,
      reservationRemoveAllModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.reservationLoad = this.reservationLoad.bind(this);
    this.errorHandle = this.errorHandle.bind(this);
    this.reservationClick = this.reservationClick.bind(this);
    this.reservationRemove = this.reservationRemove.bind(this);
    this.reservationRemoveAll = this.reservationRemoveAll.bind(this);
    this.reservationRemoveAllClick = this.reservationRemoveAllClick.bind(this);

  }
  componentWillMount() {
    socket = io(configure.url, { secure: true });
    socket.on('connect', () => {
      this.setState({ realtime: true });
      socket.on('reservationCreate', (reservation) => {
        const list = JSON.parse(JSON.stringify(this.state.reservationList));
        list.unshift(reservation);
        this.setState({ reservationList: list });
      });
      socket.on('reservationDelete', (reservation) => {
        const list = JSON.parse(JSON.stringify(this.state.reservationList));
        list.splice(list.findIndex(obj => obj._id === reservation._id), 1);
        this.setState({ reservationList: list });
      });
    });
    socket.on('disconnect', () => {
      this.setState({ realtime: false });
    });
    this.reservationLoad();
  }
  componentWillUnmount() {
    socket.disconnect(true);
  }
  reservationLoad() {
    loader.on();
    this.props.reservationGetListRequest()
      .then((data) => {
        if (this.props.reservationGetList.status === 'SUCCESS') {
          loader.off();
          this.setState({ reservationList: this.props.reservationGetList.list });
        } else if (this.props.reservationGetList.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
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
  reservationClick(reservation) {
    this.setState({
      reservationModalToggle: true,
      reservationModalItem: reservation,
    });
  }
  reservationRemove() {
    loader.on();
    this.props.reservationRemoveRequest(this.state.reservationModalItem)
      .then((data) => {
        if (this.props.reservationRemove.status === 'SUCCESS') {
          this.setState({
            reservationModalToggle: false,
          });
          loader.off();
        } else if (this.props.reservationGetList.status === 'FAILURE') {
          this.reservationLoad();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  reservationRemoveAll() {
    loader.on();
    this.props.reservationRemoveAllRequest()
      .then((data) => {
        if (this.props.reservationRemoveAll.status === 'SUCCESS') {
          this.setState({ reservationRemoveAllModalToggle: false });
          this.reservationLoad();
        } else if (this.props.reservationRemoveAll.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  reservationRemoveAllClick() {
    this.setState({
      reservationRemoveAllModalToggle: true,
    });
  }
  render() {
    return (
      <div>
        <ReservationList
          reservationClick={this.reservationClick}
          reservationRemoveAllClick={this.reservationRemoveAllClick}
          list={this.state.reservationList}
          realtime={this.state.realtime}
        />
        <ReservationModal
          toggle={this.state.reservationModalToggle}
          handleRemove={this.reservationRemove}
          close={() => this.setState({ reservationModalItem: null, reservationModalToggle: false })}
        />
        <RemoveModal
          toggle={this.state.reservationRemoveAllModalToggle}
          title="주의! 리스트를 전부 삭제합니다."
          subtitle="예매 내역을 전부 삭제합니다."
          handleRemove={this.reservationRemoveAll}
          handleClose={() => this.setState({ reservationRemoveAllModalToggle: false })}
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
  reservationGetList: {
    status: state.reservation.getList.status,
    list: state.reservation.getList.list,
  },
  reservationRemove: {
    status: state.reservation.remove.status,
  },
  reservationRemoveAll: {
    status: state.reservation.removeAll.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  reservationGetListRequest: reservation.getListRequest,
  reservationRemoveRequest: reservation.removeRequest,
  reservationRemoveAllRequest: reservation.removeAllRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reservation);
