/* global fetch */
import {
  THEATER_GETLIST,
  THEATER_GETLIST_SUCCESS,
  THEATER_GETLIST_FAILURE,
  THEATER_INSERT,
  THEATER_INSERT_SUCCESS,
  THEATER_INSERT_FAILURE,
  THEATER_MODIFY,
  THEATER_MODIFY_SUCCESS,
  THEATER_MODIFY_FAILURE,
  THEATER_REMOVE,
  THEATER_REMOVE_SUCCESS,
  THEATER_REMOVE_FAILURE,
  THEATER_REMOVEALL,
  THEATER_REMOVEALL_SUCCESS,
  THEATER_REMOVEALL_FAILURE,
} from './actions';

import {
  configure,
} from '../modules';

const API = configure.url;

const getList = function getList() {
  return {
    type: THEATER_GETLIST,
  };
};
const getListSuccess = function getListSuccess(list) {
  return {
    type: THEATER_GETLIST_SUCCESS,
    list,
  };
};
const getListFailure = function getListFailure(error) {
  return {
    type: THEATER_GETLIST_FAILURE,
    error,
  };
};
const getListRequest = function getListRequest() {
  return (dispatch) => {
    dispatch(getList());
    return fetch(`${API}/api/theater`, {
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
    type: THEATER_INSERT,
  };
};
const insertSuccess = function insertSuccess(theater) {
  return {
    type: THEATER_INSERT_SUCCESS,
    theater,
  };
};
const insertFailure = function insertFailure(error) {
  return {
    type: THEATER_INSERT_FAILURE,
    error,
  };
};
const insertRequest = function insertRequest(theater) {
  return (dispatch) => {
    dispatch(insert());
    return fetch(`${API}/api/theater`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: theater,
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
    type: THEATER_MODIFY,
  };
};
const modifySuccess = function modifySuccess() {
  return {
    type: THEATER_MODIFY_SUCCESS,
  };
};
const modifyFailure = function modifyFailure(error) {
  return {
    type: THEATER_MODIFY_FAILURE,
    error,
  };
};
const modifyRequest = function modifyRequest(theater) {
  return (dispatch) => {
    dispatch(modify());
    return fetch(`${API}/api/theater`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: theater,
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
          return dispatch(modifySuccess());
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
    type: THEATER_REMOVE,
  };
};
const removeSuccess = function removeSuccess() {
  return {
    type: THEATER_REMOVE_SUCCESS,
  };
};
const removeFailure = function removeFailure(error) {
  return {
    type: THEATER_REMOVE_FAILURE,
    error,
  };
};
const removeAll = function removeAll() {
  return {
    type: THEATER_REMOVEALL,
  };
};
const removeAllSuccess = function removeAllSuccess() {
  return {
    type: THEATER_REMOVEALL_SUCCESS,
  };
};
const removeAllFailure = function removeAllFailure(error) {
  return {
    type: THEATER_REMOVEALL_FAILURE,
    error,
  };
};
const removeAllRequest = function removeAllRequest() {
  return (dispatch) => {
    dispatch(removeAll());
    return fetch(`${API}/api/theater/all`, {
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
const removeRequest = function removeRequest(theater) {
  return (dispatch) => {
    dispatch(remove());
    return fetch(`${API}/api/theater`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: theater,
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
export default {
  getListRequest,
  insertRequest,
  modifyRequest,
  removeRequest,
  removeAllRequest,
};
