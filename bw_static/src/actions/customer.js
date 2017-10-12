/* global fetch */
import {
  CUSTOMER_GET,
  CUSTOMER_GET_SUCCESS,
  CUSTOMER_GET_FAILURE,
  CUSTOMER_GETLIST,
  CUSTOMER_GETLIST_SUCCESS,
  CUSTOMER_GETLIST_FAILURE,
  CUSTOMER_INSERT,
  CUSTOMER_INSERT_SUCCESS,
  CUSTOMER_INSERT_FAILURE,
  CUSTOMER_MODIFY,
  CUSTOMER_MODIFY_SUCCESS,
  CUSTOMER_MODIFY_FAILURE,
  CUSTOMER_REMOVE,
  CUSTOMER_REMOVE_SUCCESS,
  CUSTOMER_REMOVE_FAILURE,
  CUSTOMER_REMOVEALL,
  CUSTOMER_REMOVEALL_SUCCESS,
  CUSTOMER_REMOVEALL_FAILURE,
  CUSTOMER_EXCEL,
  CUSTOMER_EXCEL_SUCCESS,
  CUSTOMER_EXCEL_FAILURE,
  CUSTOMER_EXCELDOWNLOAD,
  CUSTOMER_EXCELDOWNLOAD_SUCCESS,
  CUSTOMER_EXCELDOWNLOAD_FAILURE,
  CUSTOMER_BULKINSERT,
  CUSTOMER_BULKINSERT_SUCCESS,
  CUSTOMER_BULKINSERT_FAILURE,
} from './actions';

import {
  configure,
} from '../modules';

const API = configure.url;

const get = function get() {
  return {
    type: CUSTOMER_GET,
  };
};
const getSuccess = function getSuccess(customer) {
  return {
    type: CUSTOMER_GET_SUCCESS,
    customer,
  };
};
const getFailure = function getFailure(error) {
  return {
    type: CUSTOMER_GET_FAILURE,
    error,
  };
};
const getRequest = function getRequest(barcode_id) {
  return (dispatch) => {
    dispatch(get());
    return fetch(`${API}/api/customer/barcode/${barcode_id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
      },
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(getSuccess(res.data));
        }
        return dispatch(getFailure({
          error: null,
          message: '바코드 ID가 잘못 읽혀졌습니다.',
        }));
      })
      .catch(e => dispatch(getFailure(e)));
  };
};
const getList = function getList() {
  return {
    type: CUSTOMER_GETLIST,
  };
};
const getListSuccess = function getListSuccess(list) {
  return {
    type: CUSTOMER_GETLIST_SUCCESS,
    list,
  };
};
const getListFailure = function getListFailure(error) {
  return {
    type: CUSTOMER_GETLIST_FAILURE,
    error,
  };
};
const getListRequest = function getListRequest() {
  return (dispatch) => {
    dispatch(getList());
    return fetch(`${API}/api/customer`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
      },
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(getListSuccess(res.data));
        }
        return dispatch(getListFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => dispatch(getListFailure(e)));
  };
};
const insert = function insert() {
  return {
    type: CUSTOMER_INSERT,
  };
};
const insertSuccess = function insertSuccess(customer) {
  return {
    type: CUSTOMER_INSERT_SUCCESS,
    customer,
  };
};
const insertFailure = function insertFailure(error) {
  return {
    type: CUSTOMER_INSERT_FAILURE,
    error,
  };
};
const insertRequest = function insertRequest(customer) {
  return (dispatch) => {
    dispatch(insert());
    return fetch(`${API}/api/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: customer,
      }),
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(insertSuccess(res.data));
        }
        return dispatch(insertFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => dispatch(insertFailure(e)));
  };
};
const modify = function modify() {
  return {
    type: CUSTOMER_MODIFY,
  };
};
const modifySuccess = function modifySuccess() {
  return {
    type: CUSTOMER_MODIFY_SUCCESS,
  };
};
const modifyFailure = function modifyFailure(error) {
  return {
    type: CUSTOMER_MODIFY_FAILURE,
    error,
  };
};
const modifyRequest = function modifyRequest(customer, staff) {
  return (dispatch) => {
    dispatch(modify());
    return fetch(`${API}/api/customer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: customer,
      }),
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          const modifyData = res.data;
          return fetch(`${API}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              data: {
                customerName: customer.name,
                customerPhone: customer.phone,
                barcode_id: customer.barcode_id,
                bus: customer.bus,
                state: customer.state,
                enteringBus: customer.enteringBus,
                outgoingBus: customer.outgoingBus,
                staffSn: staff.sn,
                staffName: staff.name,
              },
            }),
          })
            .then((res) => {
              if (res.ok) { return res.json(); }
              return res.json().then((error) => {
                throw error;
              });
            })
            .then((res) => {
              if (res.data) {
                return dispatch(modifySuccess(modifyData));
              }
              return dispatch(modifyFailure({
                error: null,
                message: '알 수 없는 오류',
              }));
            })
            .catch(e => dispatch(modifyFailure(e)));
        }
        return dispatch(modifyFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => dispatch(modifyFailure(e)));
  };
};
const remove = function remove() {
  return {
    type: CUSTOMER_REMOVE,
  };
};
const removeSuccess = function removeSuccess() {
  return {
    type: CUSTOMER_REMOVE_SUCCESS,
  };
};
const removeFailure = function removeFailure(error) {
  return {
    type: CUSTOMER_REMOVE_FAILURE,
    error,
  };
};
const removeRequest = function removeRequest(customer) {
  return (dispatch) => {
    dispatch(remove());
    return fetch(`${API}/api/customer`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: customer,
      }),
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(removeSuccess(res.data));
        }
        return dispatch(removeFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => dispatch(removeFailure(e)));
  };
};
const removeAll = function removeAll() {
  return {
    type: CUSTOMER_REMOVEALL,
  };
};
const removeAllSuccess = function removeAllSuccess() {
  return {
    type: CUSTOMER_REMOVEALL_SUCCESS,
  };
};
const removeAllFailure = function removeAllFailure(error) {
  return {
    type: CUSTOMER_REMOVEALL_FAILURE,
    error,
  };
};
const removeAllRequest = function removeAllRequest() {
  return (dispatch) => {
    dispatch(removeAll());
    return fetch(`${API}/api/customer/all`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(removeAllSuccess(res.data));
        }
        return dispatch(removeAllFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => dispatch(removeAllFailure(e)));
  };
};
const excel = function excel() {
  return {
    type: CUSTOMER_EXCEL,
  };
};
const excelSuccess = function excelSuccess(parsedExcelData) {
  return {
    type: CUSTOMER_EXCEL_SUCCESS,
    parsedExcelData,
  };
};
const excelFailure = function excelFailure(error) {
  return {
    type: CUSTOMER_EXCEL_FAILURE,
    error,
  };
};
const excelRequest = function excelRequest(excelFile) {
  return (dispatch) => {
    dispatch(excel());
    const data = new FormData();
    data.append('file', excelFile);
    return fetch(`${configure.url}/api/customer/excel`, {
      method: 'POST',
      credentials: 'include',
      body: data,
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(excelSuccess(res.data));
        }
        return dispatch(excelFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => dispatch(excelFailure(e)));
  };
};
const excelDownload = function excelDownload() {
  return {
    type: CUSTOMER_EXCELDOWNLOAD,
  };
};
const excelDownloadSuccess = function excelDownloadSuccess(file) {
  return {
    type: CUSTOMER_EXCELDOWNLOAD_SUCCESS,
    file,
  };
};
const excelDownloadFailure = function excelDownloadFailure(error) {
  return {
    type: CUSTOMER_EXCELDOWNLOAD_FAILURE,
    error,
  };
};
const excelDownloadRequest = function excelDownloadRequest() {
  return (dispatch) => {
    dispatch(excelDownload());
    return fetch(`${API}/api/customer/exceldownload`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
      },
    })
      .then((res) => {
        if (res.ok) { return res.blob(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then(file => {
        if (file) {
          return dispatch(excelDownloadSuccess(file));
        }
        return dispatch(excelDownloadFailure({
          error: null,
          message: '에러가 있습니다.',
        }));
      })
      .catch(e => dispatch(excelDownloadFailure(e)));
  };
};
const bulkInsert = function bulkInsert() {
  return {
    type: CUSTOMER_BULKINSERT,
  };
};
const bulkInsertSuccess = function bulkInsertSuccess() {
  return {
    type: CUSTOMER_BULKINSERT_SUCCESS,
  };
};
const bulkInsertFailure = function bulkInsertFailure(error) {
  return {
    type: CUSTOMER_BULKINSERT_FAILURE,
    error,
  };
};
const bulkInsertRequest = function bulkInsertRequest(bulk) {
  return (dispatch) => {
    dispatch(bulkInsert());
    return fetch(`${API}/api/customer/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: bulk,
      }),
    })
      .then((res) => {
        if (res.ok) { return res.json(); }
        return res.json().then((error) => {
          throw error;
        });
      })
      .then((res) => {
        if (res.data) {
          return dispatch(bulkInsertSuccess(res.data));
        }
        return dispatch(bulkInsertFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => dispatch(bulkInsertFailure(e)));
  };
};
export default {
  getListRequest,
  insertRequest,
  modifyRequest,
  removeRequest,
  removeAllRequest,
  getRequest,
  excelRequest,
  excelDownloadRequest,
  bulkInsertRequest,
};
