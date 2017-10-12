/* global fetch */
import {
  WORK_GETLIST,
  WORK_GETLIST_SUCCESS,
  WORK_GETLIST_FAILURE,
  WORK_INSERT,
  WORK_INSERT_SUCCESS,
  WORK_INSERT_FAILURE,
  WORK_MODIFY,
  WORK_MODIFY_SUCCESS,
  WORK_MODIFY_FAILURE,
  WORK_REMOVE,
  WORK_REMOVE_SUCCESS,
  WORK_REMOVE_FAILURE,
  WORK_REMOVEALL,
  WORK_REMOVEALL_SUCCESS,
  WORK_REMOVEALL_FAILURE,
  WORK_EXCELDOWNLOAD,
  WORK_EXCELDOWNLOAD_SUCCESS,
  WORK_EXCELDOWNLOAD_FAILURE,
  WORK_BULKINSERT,
  WORK_BULKINSERT_SUCCESS,
  WORK_BULKINSERT_FAILURE,
} from './actions';

import {
  configure,
} from '../modules';

const API = configure.url;

const getList = function getList() {
  return {
    type: WORK_GETLIST,
  };
};
const getListSuccess = function getListSuccess(list) {
  return {
    type: WORK_GETLIST_SUCCESS,
    list,
  };
};
const getListFailure = function getListFailure(error) {
  return {
    type: WORK_GETLIST_FAILURE,
    error,
  };
};
const getListRequest = function getListRequest() {
  return (dispatch) => {
    dispatch(getList());
    return fetch(`${API}/api/work`, {
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
          const data = res.data;
          data.forEach((obj) => {
            obj.datetime = new Date(obj.datetime);
            obj.datetimeString = obj.datetime.toLocaleDateString();
            obj.datetimeTimeString = obj.datetime.toLocaleTimeString();
            obj.endDatetime = new Date(obj.endDatetime);
            obj.endDatetimeString = obj.endDatetime.toLocaleDateString();
            obj.endDatetimeTimeString = obj.endDatetime.toLocaleTimeString();
          });
          const sortedData = data.sort((a, b) =>
            b.datetime.getTime() - a.datetime.getTime(),
          );
          return dispatch(getListSuccess(sortedData));
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
    type: WORK_INSERT,
  };
};
const insertSuccess = function insertSuccess(work) {
  return {
    type: WORK_INSERT_SUCCESS,
    work,
  };
};
const insertFailure = function insertFailure(error) {
  return {
    type: WORK_INSERT_FAILURE,
    error,
  };
};
const insertRequest = function insertRequest(work) {
  return (dispatch) => {
    dispatch(insert());
    return fetch(`${API}/api/work`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: work,
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
    type: WORK_MODIFY,
  };
};
const modifySuccess = function modifySuccess() {
  return {
    type: WORK_MODIFY_SUCCESS,
  };
};
const modifyFailure = function modifyFailure(error) {
  return {
    type: WORK_MODIFY_FAILURE,
    error,
  };
};
const modifyRequest = function modifyRequest(work) {
  return (dispatch) => {
    dispatch(modify());
    return fetch(`${API}/api/work`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: work,
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
          return dispatch(modifySuccess(res.data));
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
    type: WORK_REMOVE,
  };
};
const removeSuccess = function removeSuccess() {
  return {
    type: WORK_REMOVE_SUCCESS,
  };
};
const removeFailure = function removeFailure(error) {
  return {
    type: WORK_REMOVE_FAILURE,
    error,
  };
};
const removeRequest = function removeRequest(work) {
  return (dispatch) => {
    dispatch(remove());
    return fetch(`${API}/api/work`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: work,
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
    type: WORK_REMOVEALL,
  };
};
const removeAllSuccess = function removeAllSuccess() {
  return {
    type: WORK_REMOVEALL_SUCCESS,
  };
};
const removeAllFailure = function removeAllFailure(error) {
  return {
    type: WORK_REMOVEALL_FAILURE,
    error,
  };
};
const removeAllRequest = function removeAllRequest() {
  return (dispatch) => {
    dispatch(removeAll());
    return fetch(`${API}/api/work/all`, {
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
const excelDownload = function excelDownload() {
  return {
    type: WORK_EXCELDOWNLOAD,
  };
};
const excelDownloadSuccess = function excelDownloadSuccess(file) {
  return {
    type: WORK_EXCELDOWNLOAD_SUCCESS,
    file,
  };
};
const excelDownloadFailure = function excelDownloadFailure(error) {
  return {
    type: WORK_EXCELDOWNLOAD_FAILURE,
    error,
  };
};
const excelDownloadRequest = function excelDownloadRequest() {
  return (dispatch) => {
    dispatch(excelDownload());
    return fetch(`${API}/api/work/exceldownload`, {
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
    type: WORK_BULKINSERT,
  };
};
const bulkInsertSuccess = function bulkInsertSuccess() {
  return {
    type: WORK_BULKINSERT_SUCCESS,
  };
};
const bulkInsertFailure = function bulkInsertFailure(error) {
  return {
    type: WORK_BULKINSERT_FAILURE,
    error,
  };
};
const bulkInsertRequest = function bulkInsertRequest(bulk) {
  return (dispatch) => {
    dispatch(bulkInsert());
    return fetch(`${API}/api/work/bulk`, {
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
  excelDownloadRequest,
  bulkInsertRequest,
};
