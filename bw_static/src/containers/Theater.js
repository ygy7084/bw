import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  theater,
} from '../actions';

import {
  TheaterList,
  TheaterModal,
  TheaterInsertModal,
  RemoveModal,
  ErrorModal,
} from '../components';

import {
  loader,
} from '../modules';

class Theater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theaterModalToggle: false,
      theaterModalItem: null,
      theaterInsertModalToggle: false,
      theaterRemoveAllModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.errorHandle = this.errorHandle.bind(this);
    this.theaterLoad = this.theaterLoad.bind(this);
    this.theaterClick = this.theaterClick.bind(this);
    this.theaterInsertClick = this.theaterInsertClick.bind(this);
    this.theaterInsert = this.theaterInsert.bind(this);
    this.theaterModify = this.theaterModify.bind(this);
    this.theaterRemove = this.theaterRemove.bind(this);
    this.theaterRemoveAll = this.theaterRemoveAll.bind(this);
    this.theaterRemoveAllClick = this.theaterRemoveAllClick.bind(this);
  }
  componentWillMount() {
    this.theaterLoad();
  }
  theaterLoad() {
    loader.on();
    this.props.theaterGetListRequest()
      .then((data) => {
        if (this.props.theaterGetList.status === 'SUCCESS') {
          loader.off();
        } else if (this.props.theaterGetList.status === 'FAILURE') {
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
  theaterClick(theater) {
    this.setState({
      theaterModalToggle: true,
      theaterModalItem: theater,
    });
  }
  theaterInsertClick() {
    this.setState({
      theaterInsertModalToggle: true,
    });
  }
  theaterInsert(theater) {
    loader.on();
    this.props.theaterInsertRequest(theater)
      .then((data) => {
        if (this.props.theaterInsert.status === 'SUCCESS') {
          this.setState({ theaterInsertModalToggle: false });
          this.theaterLoad();
        } else if (this.props.theaterInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  theaterModify(theater) {
    loader.on();
    this.props.theaterModifyRequest(theater)
      .then((data) => {
        if (this.props.theaterModify.status === 'SUCCESS') {
          this.setState({ theaterModalToggle: false });
          this.theaterLoad();
        } else if (this.props.theaterModify.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  theaterRemove(theaterId) {
    loader.on();
    this.props.theaterRemoveRequest(theaterId)
      .then((data) => {
        if (this.props.theaterRemove.status === 'SUCCESS') {
          this.setState({ theaterModalToggle: false });
          this.theaterLoad();
        } else if (this.props.theaterRemove.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  theaterRemoveAll() {
    loader.on();
    this.props.theaterRemoveAllRequest()
      .then((data) => {
        if (this.props.theaterRemoveAll.status === 'SUCCESS') {
          this.setState({ theaterRemoveAllModalToggle: false });
          this.theaterLoad();
        } else if (this.props.theaterRemoveAll.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  theaterRemoveAllClick() {
    this.setState({
      theaterRemoveAllModalToggle: true,
    });
  }
  render() {
    return (
      <div>
        <TheaterList
          theaterClick={this.theaterClick}
          theaterInsertClick={this.theaterInsertClick}
          theaterRemoveAllClick={this.theaterRemoveAllClick}
          list={this.props.theaterGetList.list}
          refresh={this.theaterLoad}
        />
        <TheaterModal
          toggle={this.state.theaterModalToggle}
          close={() => this.setState({ theaterModalItem: null, theaterModalToggle: false })}
          theater={this.state.theaterModalItem}
          modify={this.theaterModify}
          remove={this.theaterRemove}
        />
        <TheaterInsertModal
          toggle={this.state.theaterInsertModalToggle}
          close={() => this.setState({ theaterInsertModalToggle: false })}
          insert={this.theaterInsert}
        />
        <RemoveModal
          toggle={this.state.theaterRemoveAllModalToggle}
          title="주의! 리스트를 전부 삭제합니다."
          subtitle="영화관 리스트가 전부 삭제됩니다."
          handleRemove={this.theaterRemoveAll}
          handleClose={() => this.setState({ theaterRemoveAllModalToggle: false })}
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
  theaterGetList: {
    status: state.theater.getList.status,
    list: state.theater.getList.list,
  },
  theaterInsert: {
    status: state.theater.insert.status,
    theater: state.theater.insert.theater,
  },
  theaterModify: {
    status: state.theater.modify.status,
  },
  theaterRemove: {
    status: state.theater.remove.status,
  },
  theaterRemoveAll: {
    status: state.theater.removeAll.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  theaterGetListRequest: theater.getListRequest,
  theaterInsertRequest: theater.insertRequest,
  theaterModifyRequest: theater.modifyRequest,
  theaterRemoveRequest: theater.removeRequest,
  theaterRemoveAllRequest: theater.removeAllRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Theater);
