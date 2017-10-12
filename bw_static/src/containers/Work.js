import React from 'react';
import fileDownload from 'react-file-download';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  staff,
  work,
} from '../actions';

import {
  StaffList,
  WorkList,
  WorkModal,
  WorkInsertModal,
  WorkOrStaff,
  RemoveModal,
  ErrorModal,
} from '../components';

import {
  loader,
} from '../modules';

class Work extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'staff',
      workModalToggle: false,
      workModalItem: null,
      workInsertModalToggle: false,
      workRemoveAllModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.modeChange = this.modeChange.bind(this);
    this.errorHandle = this.errorHandle.bind(this);
    this.staffLoad = this.staffLoad.bind(this);
    this.workLoad = this.workLoad.bind(this);
    this.workClick = this.workClick.bind(this);
    this.workInsertClick = this.workInsertClick.bind(this);
    this.workInsert = this.workInsert.bind(this);
    this.workModify = this.workModify.bind(this);
    this.workRemove = this.workRemove.bind(this);
    this.workRemoveAll = this.workRemoveAll.bind(this);
    this.workRemoveAllClick = this.workRemoveAllClick.bind(this);
    this.excelDownload = this.excelDownload.bind(this);
  }
  componentWillMount() {
    this.staffLoad();
  }
  modeChange(mode) {
    this.setState({ mode });
    if (mode === 'staff') {
      this.staffLoad();
    } else if (mode === 'work') {
      this.workLoad();
    }
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
  workClick(work) {
    this.setState({
      workModalToggle: true,
      workModalItem: work,
    });
  }
  workInsertClick(staff) {
    this.setState({
      workInsertModalToggle: true,
      workInsertModalItem: staff,
    });
  }
  workInsert(work) {
    loader.on();
    this.props.workInsertRequest(work)
      .then((data) => {
        if (this.props.workInsert.status === 'SUCCESS') {
          loader.off();
          this.setState({ workInsertModalToggle: false });
        } else if (this.props.workInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  workModify(work) {
    loader.on();
    this.props.workModifyRequest(work)
      .then((data) => {
        if (this.props.workModify.status === 'SUCCESS') {
          this.setState({ workModalToggle: false });
          this.workLoad();
        } else if (this.props.workModify.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  workRemove(work) {
    loader.on();
    this.props.workRemoveRequest(work)
      .then((data) => {
        if (this.props.workRemove.status === 'SUCCESS') {
          this.setState({ workModalToggle: false, });
          this.workLoad();
        } else if (this.props.workRemove.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  workRemoveAll() {
    loader.on();
    this.props.workRemoveAllRequest()
      .then((data) => {
        if (this.props.workRemoveAll.status === 'SUCCESS') {
          this.setState({ workRemoveAllModalToggle: false });
          this.workLoad();
        } else if (this.props.workRemoveAll.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  workRemoveAllClick() {
    this.setState({
      workRemoveAllModalToggle: true,
    });
  }
  excelDownload() {
    loader.on();
    this.props.workExcelDownloadRequest()
      .then((data) => {
        if (this.props.workExcelDownload.status === 'SUCCESS') {
          loader.off();
          fileDownload(this.props.workExcelDownload.file, 'works.xlsx');
        } else {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  render() {
    return (
      <div>
        <WorkOrStaff
          mode={this.state.mode}
          modeChange={this.modeChange}
        />
        {this.state.mode === 'staff' ?
          <div>
            <StaffList
              staffClick={this.workInsertClick}
              list={this.props.staffGetList.list}
              refresh={this.staffLoad}
              work
            />
            <WorkInsertModal
              toggle={this.state.workInsertModalToggle}
              staff={this.state.workInsertModalItem}
              close={() => this.setState({ workInsertModalToggle: false })}
              insert={this.workInsert}
            />
          </div>
          :
          <div>
            <WorkList
              workClick={this.workClick}
              workRemoveAllClick={this.workRemoveAllClick}
              list={this.props.workGetList.list}
              excelDownload={this.excelDownload}
              refresh={this.workLoad}
            />
            <WorkModal
              toggle={this.state.workModalToggle}
              close={() => this.setState({ workModalItem: null, workModalToggle: false })}
              work={this.state.workModalItem}
              modify={this.workModify}
              remove={this.workRemove}
            />
            <RemoveModal
              toggle={this.state.workRemoveAllModalToggle}
              title="주의! 리스트를 전부 삭제합니다."
              subtitle="근무 현황이 전부 삭제됩니다."
              handleRemove={this.workRemoveAll}
              handleClose={() => this.setState({ workRemoveAllModalToggle: false })}
            />
          </div>
        }
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
  workRemove: {
    status: state.work.remove.status,
  },
  workRemoveAll: {
    status: state.work.removeAll.status,
  },
  workExcelDownload: {
    status: state.work.excelDownload.status,
    file: state.work.excelDownload.file,
  },
  workBulkInsert: {
    status: state.work.bulkInsert.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  staffGetListRequest: staff.getListRequest,
  workGetListRequest: work.getListRequest,
  workInsertRequest: work.insertRequest,
  workModifyRequest: work.modifyRequest,
  workRemoveRequest: work.removeRequest,
  workRemoveAllRequest: work.removeAllRequest,
  workExcelDownloadRequest: work.excelDownloadRequest,
  workBulkInsertRequest: work.bulkInsertRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Work);
