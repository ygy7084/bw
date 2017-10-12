import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  staff,
} from '../actions';

import {
  StaffList,
  StaffModal,
  StaffInsertModal,
  RemoveModal,
  ErrorModal,
} from '../components';

import {
  loader,
} from '../modules';

class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffModalToggle: false,
      staffModalItem: null,
      staffInsertModalToggle: false,
      staffRemoveAllModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.errorHandle = this.errorHandle.bind(this);
    this.staffLoad = this.staffLoad.bind(this);
    this.staffClick = this.staffClick.bind(this);
    this.staffInsertClick = this.staffInsertClick.bind(this);
    this.staffInsert = this.staffInsert.bind(this);
    this.staffModify = this.staffModify.bind(this);
    this.staffRemove = this.staffRemove.bind(this);
    this.staffRemoveAll = this.staffRemoveAll.bind(this);
    this.staffRemoveAllClick = this.staffRemoveAllClick.bind(this);
  }
  componentWillMount() {
    this.staffLoad();
  }
  staffLoad() {
    loader.on();
    this.props.staffGetListRequest()
      .then((data) => {
        if (this.props.staffGetList.status === 'SUCCESS') {
          loader.off();
        } else if (this.props.staffGetList.status === 'FAILURE') {
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
  staffClick(staff) {
    this.setState({
      staffModalToggle: true,
      staffModalItem: staff,
    });
  }
  staffInsertClick() {
    this.setState({
      staffInsertModalToggle: true,
    });
  }
  staffInsert(staff) {
    loader.on();
    this.props.staffInsertRequest(staff)
      .then((data) => {
        if (this.props.staffInsert.status === 'SUCCESS') {
          this.setState({ staffInsertModalToggle: false });
          this.staffLoad();
        } else if (this.props.staffInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  staffModify(staff) {
    loader.on();
    this.props.staffModifyRequest(staff)
      .then((data) => {
        if (this.props.staffModify.status === 'SUCCESS') {
          this.setState({ staffModalToggle: false });
          this.staffLoad();
        } else if (this.props.staffModify.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  staffRemove(staffId) {
    loader.on();
    this.props.staffRemoveRequest(staffId)
      .then((data) => {
        if (this.props.staffRemove.status === 'SUCCESS') {
          this.setState({ staffModalToggle: false });
          this.staffLoad();
        } else if (this.props.staffRemove.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  staffRemoveAll() {
    loader.on();
    this.props.staffRemoveAllRequest()
      .then((data) => {
        if (this.props.staffRemoveAll.status === 'SUCCESS') {
          this.setState({ staffRemoveAllModalToggle: false });
          this.staffLoad();
        } else if (this.props.staffRemoveAll.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  staffRemoveAllClick() {
    this.setState({
      staffRemoveAllModalToggle: true,
    });
  }
  render() {
    return (
      <div>
        <StaffList
          staffClick={this.staffClick}
          staffInsertClick={this.staffInsertClick}
          staffRemoveAllClick={this.staffRemoveAllClick}
          list={this.props.staffGetList.list}
          refresh={this.staffLoad}
        />
        <StaffModal
          toggle={this.state.staffModalToggle}
          close={() => this.setState({ staffModalItem: null, staffModalToggle: false })}
          staff={this.state.staffModalItem}
          modify={this.staffModify}
          remove={this.staffRemove}
        />
        <StaffInsertModal
          toggle={this.state.staffInsertModalToggle}
          close={() => this.setState({ staffInsertModalToggle: false })}
          insert={this.staffInsert}
        />
        <RemoveModal
          toggle={this.state.staffRemoveAllModalToggle}
          title="주의! 리스트를 전부 삭제합니다."
          subtitle="최초 관리자 계정(사번 0000)을 제외하고 전부 삭제됩니다."
          handleRemove={this.staffRemoveAll}
          handleClose={() => this.setState({ staffRemoveAllModalToggle: false })}
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
  staffGetList: {
    status: state.staff.getList.status,
    list: state.staff.getList.list,
  },
  staffInsert: {
    status: state.staff.insert.status,
    staff: state.staff.insert.staff,
  },
  staffModify: {
    status: state.staff.modify.status,
  },
  staffRemove: {
    status: state.staff.remove.status,
  },
  staffRemoveAll: {
    status: state.staff.removeAll.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  staffGetListRequest: staff.getListRequest,
  staffInsertRequest: staff.insertRequest,
  staffModifyRequest: staff.modifyRequest,
  staffRemoveRequest: staff.removeRequest,
  staffRemoveAllRequest: staff.removeAllRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Staff);
