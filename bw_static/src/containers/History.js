import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  history,
} from '../actions';

import {
  HistoryList,
  RemoveModal,
  ErrorModal,
} from '../components';

import {
  loader,
  configure,
} from '../modules';

let socket;
class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      realtime: false,
      historyList: [],
      historyRemoveAllModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.loadHistory = this.loadHistory.bind(this);
    this.historyRemoveAll = this.historyRemoveAll.bind(this);
    this.errorHandle = this.errorHandle.bind(this);
    this.historyRemoveAllClick = this.historyRemoveAllClick.bind(this);
  }
  componentWillMount() {
    socket = io(configure.url, { secure: true });
    socket.on('connect', () => {
      this.setState({ realtime: true });
      socket.on('historyCreate', (history) => {
        const list = JSON.parse(JSON.stringify(this.state.historyList));
        history.datetimeString = new Date(history.datetime).toLocaleString();
        list.unshift(history);
        this.setState({ historyList: list });
      });
      socket.on('historyDelete', () => {
        this.loadHistory();
      });
    });
    socket.on('disconnect', () => {
      this.setState({ realtime: false });
    });
    this.loadHistory();
  }
  componentWillUnmount() {
    socket.disconnect(true);
  }
  loadHistory() {
    loader.on();
    this.props.historyGetListRequest()
      .then((data) => {
        if (this.props.historyGetList.status === 'SUCCESS') {
          loader.off();
          this.setState({ historyList: this.props.historyGetList.list });
        } else if (this.props.historyGetList.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  historyRemoveAll() {
    loader.on();
    this.props.historyRemoveAllRequest()
      .then((data) => {
        if (this.props.historyRemoveAll.status === 'SUCCESS') {
          loader.off();
          this.setState({
            historyRemoveAllModalToggle: false,
          });
          this.loadHistory();
        } else if (this.props.historyGetList.status === 'FAILURE') {
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
  historyRemoveAllClick() {
    this.setState({
      historyRemoveAllModalToggle: true,
    });
  }
  render() {
    return (
      <div>
        <HistoryList
          list={this.state.historyList}
          historyRemoveAllClick={this.historyRemoveAllClick}
          realtime={this.state.realtime}
        />
        <RemoveModal
          toggle={this.state.historyRemoveAllModalToggle}
          title="주의! 리스트를 전부 삭제합니다."
          subtitle="실시간 추적 내역을 전부 삭제합니다."
          handleRemove={this.historyRemoveAll}
          handleClose={() => this.setState({ historyRemoveAllModalToggle: false })}
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
  historyGetList: {
    status: state.history.getList.status,
    list: state.history.getList.list,
  },
  historyRemoveAll: {
    status: state.history.removeAll.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  historyGetListRequest: history.getListRequest,
  historyRemoveAllRequest: history.removeAllRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(History);
