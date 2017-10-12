import React from 'react';
import fileDownload from 'react-file-download';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  customer,
  bus,
} from '../actions';

import {
  CustomerList,
  CustomerModal,
  CustomerInsertModal,
  CustomerExcelModal,
  RemoveModal,
  ErrorModal,
} from '../components';

import {
  loader,
} from '../modules';

class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerModalToggle: false,
      customerModalItem: null,
      customerInsertModalToggle: false,
      customerExcelModalToggle: false,
      customerRemoveAllModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.errorHandle = this.errorHandle.bind(this);
    this.customerLoad = this.customerLoad.bind(this);
    this.customerClick = this.customerClick.bind(this);
    this.customerInsertClick = this.customerInsertClick.bind(this);
    this.customerInsert = this.customerInsert.bind(this);
    this.customerExcel = this.customerExcel.bind(this);
    this.customerBulkInsert = this.customerBulkInsert.bind(this);
    this.customerModify = this.customerModify.bind(this);
    this.customerRemove = this.customerRemove.bind(this);
    this.customerRemoveAll = this.customerRemoveAll.bind(this);
    this.customerRemoveAllClick = this.customerRemoveAllClick.bind(this);
    this.excelDownload = this.excelDownload.bind(this);
  }
  componentWillMount() {
    this.customerLoad();
  }
  customerLoad() {
    loader.on();
    this.props.customerGetListRequest()
      .then((data) => {
        if (this.props.customerGetList.status === 'SUCCESS') {
          // Bus Load
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
        } else if (this.props.customerGetList.status === 'FAILURE') {
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
  customerClick(customer) {
    this.setState({
      customerModalToggle: true,
      customerModalItem: customer,
    });
  }
  customerInsertClick() {
    this.setState({
      customerInsertModalToggle: true,
    });
  }
  customerInsert(customer) {
    loader.on();
    this.props.customerInsertRequest(customer)
      .then((data) => {
        if (this.props.customerInsert.status === 'SUCCESS') {
          this.setState({ customerInsertModalToggle: false });
          this.customerLoad();
        } else if (this.props.customerInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  customerExcel(excelFile) {
    loader.on();
    this.props.customerExcelRequest(excelFile)
      .then((data) => {
        if (this.props.customerExcel.status === 'SUCCESS') {
          loader.off();
          this.setState({
            customerInsertModalToggle: false,
            customerExcelModalToggle: true,
          });
        } else if (this.props.customerExcel.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  customerBulkInsert(bulk) {
    loader.on();
    this.props.customerBulkInsertRequest(bulk)
      .then((data) => {
        if (this.props.customerBulkInsert.status === 'SUCCESS') {
          this.setState({
            customerExcelModalToggle: false,
          });
          this.customerLoad();
        } else if (this.props.customerBulkInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  customerModify(customer) {
    loader.on();
    this.props.customerModifyRequest(customer, this.props.staffSession.staff)
      .then((data) => {
        if (this.props.customerModify.status === 'SUCCESS') {
          this.setState({ customerModalToggle: false });
          this.customerLoad();
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
  customerRemove(customerId) {
    loader.on();
    this.props.customerRemoveRequest(customerId)
      .then((data) => {
        if (this.props.customerRemove.status === 'SUCCESS') {
          this.setState({ customerModalToggle: false });
          this.customerLoad();
        } else if (this.props.customerRemove.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  customerRemoveAll() {
    loader.on();
    this.props.customerRemoveAllRequest()
      .then((data) => {
        if (this.props.customerRemoveAll.status === 'SUCCESS') {
          this.setState({ customerRemoveAllModalToggle: false });
          this.customerLoad();
        } else if (this.props.customerRemoveAll.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  customerRemoveAllClick() {
    this.setState({
      customerRemoveAllModalToggle: true,
    });
  }
  excelDownload() {
    loader.on();
    this.props.customerExcelDownloadRequest()
      .then((data) => {
        if (this.props.customerExcelDownload.status === 'SUCCESS') {
          loader.off();
          fileDownload(this.props.customerExcelDownload.file, 'customers.xlsx');
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
        <CustomerList
          customerClick={this.customerClick}
          customerInsertClick={this.customerInsertClick}
          customerRemoveAllClick={this.customerRemoveAllClick}
          list={this.props.customerGetList.list}
          refresh={this.customerLoad}
          excelDownload={this.excelDownload}
        />
        <CustomerModal
          toggle={this.state.customerModalToggle}
          close={() => this.setState({ customerModalItem: null, customerModalToggle: false })}
          customer={this.state.customerModalItem}
          busList={this.props.busGetList.list}
          modify={this.customerModify}
          remove={this.customerRemove}
        />
        <CustomerInsertModal
          toggle={this.state.customerInsertModalToggle}
          close={() => this.setState({ customerInsertModalToggle: false })}
          busList={this.props.busGetList.list}
          insert={this.customerInsert}
          customerExcel={this.customerExcel}
        />
        <CustomerExcelModal
          toggle={this.state.customerExcelModalToggle}
          close={() => this.setState({ customerExcelModalToggle: false })}
          parsedExcelData={this.props.customerExcel.parsedExcelData}
          customerBulkInsert={this.customerBulkInsert}
        />
        <RemoveModal
          toggle={this.state.customerRemoveAllModalToggle}
          title="주의! 리스트를 전부 삭제합니다."
          subtitle="고객 리스트가 전부 삭제됩니다."
          handleRemove={this.customerRemoveAll}
          handleClose={() => this.setState({ customerRemoveAllModalToggle: false })}
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
  staffSession: {
    status: state.staff.session.status,
    staff: state.staff.session.staff,
  },
  customerGetList: {
    status: state.customer.getList.status,
    list: state.customer.getList.list,
  },
  customerInsert: {
    status: state.customer.insert.status,
    customer: state.customer.insert.customer,
  },
  customerModify: {
    status: state.customer.modify.status,
  },
  customerRemove: {
    status: state.customer.remove.status,
  },
  customerRemoveAll: {
    status: state.customer.removeAll.status,
  },
  customerExcel: {
    status: state.customer.excel.status,
    parsedExcelData: state.customer.excel.parsedExcelData,
  },
  customerExcelDownload: {
    status: state.customer.excelDownload.status,
    file: state.customer.excelDownload.file,
  },
  customerBulkInsert: {
    status: state.customer.bulkInsert.status,
  },
  busGetList: {
    status: state.bus.getList.status,
    list: state.bus.getList.list,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  customerGetListRequest: customer.getListRequest,
  customerInsertRequest: customer.insertRequest,
  customerModifyRequest: customer.modifyRequest,
  customerRemoveRequest: customer.removeRequest,
  customerRemoveAllRequest: customer.removeAllRequest,
  customerExcelRequest: customer.excelRequest,
  customerExcelDownloadRequest: customer.excelDownloadRequest,
  customerBulkInsertRequest: customer.bulkInsertRequest,
  busGetListRequest: bus.getListRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Customer);
