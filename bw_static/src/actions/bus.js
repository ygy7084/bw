/* global fetch */
import {
  BUS_GET,
  BUS_GET_SUCCESS,
  BUS_GET_FAILURE,
  BUS_GETLIST,
  BUS_GETLIST_SUCCESS,
  BUS_GETLIST_FAILURE,
  BUS_INSERT,
  BUS_INSERT_SUCCESS,
  BUS_INSERT_FAILURE,
  BUS_MODIFY,
  BUS_MODIFY_SUCCESS,
  BUS_MODIFY_FAILURE,
  BUS_REMOVE,
  BUS_REMOVE_SUCCESS,
  BUS_REMOVE_FAILURE,
  BUS_REMOVEALL,
  BUS_REMOVEALL_SUCCESS,
  BUS_REMOVEALL_FAILURE,
} from './actions';

import {
  configure,
} from '../modules';

const API = configure.url;

const get = function get() {
  return {
    type: BUS_GET,
  };
};
const getSuccess = function getSuccess(bus) {
  return {
    type: BUS_GET_SUCCESS,
    bus,
  };
};
const getFailure = function getFailure(error) {
  return {
    type: BUS_GET_FAILURE,
    error,
  };
};
const getRequest = function getRequest(_id) {
  return (dispatch) => {
    dispatch(get());
    return fetch(`${API}/api/bus/${_id}`, {
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
          message: '버스 조회 에러.',
        }));
      })
      .catch(e => dispatch(getFailure(e)));
  };
};
const getList = function getList() {
  return {
    type: BUS_GETLIST,
  };
};
const getListSuccess = function getListSuccess(list) {
  return {
    type: BUS_GETLIST_SUCCESS,
    list,
  };
};
const getListFailure = function getListFailure(error) {
  return {
    type: BUS_GETLIST_FAILURE,
    error,
  };
};
const getListRequest = function getListRequest() {
  return (dispatch) => {
    dispatch(getList());
    return fetch(`${API}/api/bus`, {
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
          for (const obj of data) {
            if (obj.datetime) {
              obj.datetime = new Date(obj.datetime);
              obj.datetimeString = obj.datetime.toLocaleString();
            }
          }
          return dispatch(getListSuccess(data));
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
    type: BUS_INSERT,
  };
};
const insertSuccess = function insertSuccess(bus) {
  return {
    type: BUS_INSERT_SUCCESS,
    bus,
  };
};
const insertFailure = function insertFailure(error) {
  return {
    type: BUS_INSERT_FAILURE,
    error,
  };
};
const insertRequest = function insertRequest(bus) {
  return (dispatch) => {
    dispatch(insert());
    return fetch(`${API}/api/bus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: bus,
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
    type: BUS_MODIFY,
  };
};
const modifySuccess = function modifySuccess() {
  return {
    type: BUS_MODIFY_SUCCESS,
  };
};
const modifyFailure = function modifyFailure(error) {
  return {
    type: BUS_MODIFY_FAILURE,
    error,
  };
};
const modifyRequest = function modifyRequest(bus) {
  return (dispatch) => {
    dispatch(modify());
    return fetch(`${API}/api/bus`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: bus,
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
    type: BUS_REMOVE,
  };
};
const removeSuccess = function removeSuccess() {
  return {
    type: BUS_REMOVE_SUCCESS,
  };
};
const removeFailure = function removeFailure(error) {
  return {
    type: BUS_REMOVE_FAILURE,
    error,
  };
};
const removeRequest = function removeRequest(bus) {
  return (dispatch) => {
    dispatch(remove());
    return fetch(`${API}/api/bus`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: bus,
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
    type: BUS_REMOVEALL,
  };
};
const removeAllSuccess = function removeAllSuccess() {
  return {
    type: BUS_REMOVEALL_SUCCESS,
  };
};
const removeAllFailure = function removeAllFailure(error) {
  return {
    type: BUS_REMOVEALL_FAILURE,
    error,
  };
};
const removeAllRequest = function removeAllRequest() {
  return (dispatch) => {
    dispatch(removeAll());
    return fetch(`${API}/api/bus/all`, {
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
export default {
  getListRequest,
  insertRequest,
  modifyRequest,
  removeRequest,
  removeAllRequest,
  getRequest,
};
