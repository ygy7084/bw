import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  bus,
} from '../actions';

import {
  BusList,
  BusModal,
  BusInsertModal,
  RemoveModal,
  ErrorModal,
} from '../components';

import {
  loader,
} from '../modules';

class Bus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busModalToggle: false,
      busModalItem: null,
      busInsertModalToggle: false,
      busRemoveAllModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.errorHandle = this.errorHandle.bind(this);
    this.busLoad = this.busLoad.bind(this);
    this.busClick = this.busClick.bind(this);
    this.busInsertClick = this.busInsertClick.bind(this);
    this.busInsert = this.busInsert.bind(this);
    this.busModify = this.busModify.bind(this);
    this.busRemove = this.busRemove.bind(this);
    this.busRemoveAll = this.busRemoveAll.bind(this);
    this.busRemoveAllClick = this.busRemoveAllClick.bind(this);
  }
  componentWillMount() {
    this.busLoad();
  }
  busLoad() {
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
  busClick(bus) {
    this.setState({
      busModalToggle: true,
      busModalItem: bus,
    });
  }
  busInsertClick() {
    this.setState({
      busInsertModalToggle: true,
    });
  }
  busInsert(bus) {
    loader.on();
    this.props.busInsertRequest(bus)
      .then((data) => {
        if (this.props.busInsert.status === 'SUCCESS') {
          this.setState({ busInsertModalToggle: false });
          this.busLoad();
        } else if (this.props.busInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
        this.props.busGetListRequest()
          .then(() => loader.off())
          .catch((data) => {
            loader.off();
            this.errorHandle(data);
          });
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  busModify(bus) {
    loader.on();
    this.props.busModifyRequest(bus)
      .then((data) => {
        if (this.props.busModify.status === 'SUCCESS') {
          this.setState({ busModalToggle: false });
          this.busLoad();
        } else if (this.props.busModify.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  busRemove(busId) {
    loader.on();
    this.props.busRemoveRequest(busId)
      .then((data) => {
        if (this.props.busRemove.status === 'SUCCESS') {
          this.setState({ busModalToggle: false });
          this.busLoad();
        } else if (this.props.busRemove.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  busRemoveAll() {
    loader.on();
    this.props.busRemoveAllRequest()
      .then((data) => {
        if (this.props.busRemoveAll.status === 'SUCCESS') {
          this.setState({ busRemoveAllModalToggle: false });
          this.busLoad();
        } else if (this.props.busRemoveAll.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  busRemoveAllClick() {
    this.setState({
      busRemoveAllModalToggle: true,
    });
  }
  render() {
    return (
      <div>
        <BusList
          busClick={this.busClick}
          busInsertClick={this.busInsertClick}
          busRemoveAllClick={this.busRemoveAllClick}
          list={this.props.busGetList.list}
          refresh={this.busLoad}
        />
        <BusModal
          toggle={this.state.busModalToggle}
          close={() => this.setState({ busModalItem: null, busModalToggle: false })}
          bus={this.state.busModalItem}
          modify={this.busModify}
          remove={this.busRemove}
        />
        <BusInsertModal
          toggle={this.state.busInsertModalToggle}
          close={() => this.setState({ busInsertModalToggle: false })}
          insert={this.busInsert}
        />
        <RemoveModal
          toggle={this.state.busRemoveAllModalToggle}
          title="주의! 리스트를 전부 삭제합니다."
          subtitle="버스 리스트가 전부 삭제됩니다."
          handleRemove={this.busRemoveAll}
          handleClose={() => this.setState({ busRemoveAllModalToggle: false })}
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
  busInsert: {
    status: state.bus.insert.status,
    bus: state.bus.insert.bus,
  },
  busModify: {
    status: state.bus.modify.status,
  },
  busRemove: {
    status: state.bus.remove.status,
  },
  busRemoveAll: {
    status: state.bus.removeAll.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  busGetListRequest: bus.getListRequest,
  busInsertRequest: bus.insertRequest,
  busModifyRequest: bus.modifyRequest,
  busRemoveRequest: bus.removeRequest,
  busRemoveAllRequest: bus.removeAllRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Bus);
