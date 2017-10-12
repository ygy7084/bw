/* global fetch */
import {
  STAFF_LOGIN,
  STAFF_LOGIN_SUCCESS,
  STAFF_LOGIN_FAILURE,
  STAFF_SESSION,
  STAFF_SESSION_SUCCESS,
  STAFF_SESSION_FAILURE,
  STAFF_LOGOUT,
  STAFF_LOGOUT_SUCCESS,
  STAFF_LOGOUT_FAILURE,
  STAFF_GET,
  STAFF_GET_SUCCESS,
  STAFF_GET_FAILURE,
  STAFF_GETLIST,
  STAFF_GETLIST_SUCCESS,
  STAFF_GETLIST_FAILURE,
  STAFF_INSERT,
  STAFF_INSERT_SUCCESS,
  STAFF_INSERT_FAILURE,
  STAFF_MODIFY,
  STAFF_MODIFY_SUCCESS,
  STAFF_MODIFY_FAILURE,
  STAFF_REMOVE,
  STAFF_REMOVE_SUCCESS,
  STAFF_REMOVE_FAILURE,
  STAFF_REMOVEALL,
  STAFF_REMOVEALL_SUCCESS,
  STAFF_REMOVEALL_FAILURE,
} from './actions';

import {
  configure,
} from '../modules';

const API = configure.url;

const login = function staffLogin() {
  return {
    type: STAFF_LOGIN,
  };
};
const loginSuccess = function loginSuccess(staff) {
  return {
    type: STAFF_LOGIN_SUCCESS,
    staff,
  };
};
const loginFailure = function loginFailure(error) {
  return {
    type: STAFF_LOGIN_FAILURE,
    error,
  };
};
const loginRequest = function loginRequest(sn) {
  return (dispatch) => {
    dispatch(login());
    return fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: 'default', //required for passport module
        password: sn,
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
          return dispatch(loginSuccess(res.data));
        }
        return dispatch(loginFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(error => {
        dispatch(loginFailure(error))
      });
  };
};
const session = function session() {
  return {
    type: STAFF_SESSION,
  };
};
const sessionSuccess = function sessionSuccess(staff) {
  return {
    type: STAFF_SESSION_SUCCESS,
    staff,
  };
};
const sessionFailure = function sessionFailure(error) {
  return {
    type: STAFF_SESSION_FAILURE,
    error,
  };
};
const sessionRequest = function sessionRequest() {
  return (dispatch) => {
    dispatch(session());
    return fetch(`${API}/auth`, {
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
          return dispatch(sessionSuccess(res.data));
        }
        return dispatch(sessionFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => {
        return dispatch(sessionFailure(e));
      });
  };
};
const logout = function logout() {
  return {
    type: STAFF_LOGOUT,
  };
};
const logoutSuccess = function logoutSuccess() {
  return {
    type: STAFF_LOGOUT_SUCCESS,
  };
};
const logoutFailure = function logoutFailure(error) {
  return {
    type: STAFF_LOGOUT_FAILURE,
    error,
  };
};
const logoutRequest = function logoutRequest() {
  return (dispatch) => {
    dispatch(logout());
    return fetch(`${API}/auth/logout`, {
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
      .then((data) => {
        if (data) {
          return dispatch(logoutSuccess());
        }
        return dispatch(logoutFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(error => dispatch(logoutFailure(error)));
  };
};

const get = function get() {
  return {
    type: STAFF_GET,
  };
};
const getSuccess = function getSuccess(staff) {
  return {
    type: STAFF_GET_SUCCESS,
    staff,
  };
};
const getFailure = function getFailure(error) {
  return {
    type: STAFF_GET_FAILURE,
    error,
  };
};
const getRequest = function getRequest(barcode_id) {
  console.log(barcode_id);
  return (dispatch) => {
    dispatch(get());
    return fetch(`${API}/api/staff/barcode/${barcode_id}`, {
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
          console.log(res.data);
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
    type: STAFF_GETLIST,
  };
};
const getListSuccess = function getListSuccess(list) {
  return {
    type: STAFF_GETLIST_SUCCESS,
    list,
  };
};
const getListFailure = function getListFailure(error) {
  return {
    type: STAFF_GETLIST_FAILURE,
    error,
  };
};
const getListRequest = function getListRequest() {
  return (dispatch) => {
    dispatch(getList());
    return fetch(`${API}/api/staff`, {
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
    type: STAFF_INSERT,
  };
};
const insertSuccess = function insertSuccess(staff) {
  return {
    type: STAFF_INSERT_SUCCESS,
    staff,
  };
};
const insertFailure = function insertFailure(error) {
  return {
    type: STAFF_INSERT_FAILURE,
    error,
  };
};
const insertRequest = function insertRequest(staff) {
  return (dispatch) => {
    dispatch(insert());
    return fetch(`${API}/api/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: staff,
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
    type: STAFF_MODIFY,
  };
};
const modifySuccess = function modifySuccess() {
  return {
    type: STAFF_MODIFY_SUCCESS,
  };
};
const modifyFailure = function modifyFailure(error) {
  return {
    type: STAFF_MODIFY_FAILURE,
    error,
  };
};
const modifyRequest = function modifyRequest(staff) {
  return (dispatch) => {
    dispatch(modify());
    return fetch(`${API}/api/staff`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: staff,
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
    type: STAFF_REMOVE,
  };
};
const removeSuccess = function removeSuccess() {
  return {
    type: STAFF_REMOVE_SUCCESS,
  };
};
const removeFailure = function removeFailure(error) {
  return {
    type: STAFF_REMOVE_FAILURE,
    error,
  };
};
const removeRequest = function removeRequest(staff) {
  return (dispatch) => {
    dispatch(remove());
    return fetch(`${API}/api/staff`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: staff,
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
    type: STAFF_REMOVEALL,
  };
};
const removeAllSuccess = function removeAllSuccess() {
  return {
    type: STAFF_REMOVEALL_SUCCESS,
  };
};
const removeAllFailure = function removeAllFailure(error) {
  return {
    type: STAFF_REMOVEALL_FAILURE,
    error,
  };
};
const removeAllRequest = function removeAllRequest() {
  return (dispatch) => {
    dispatch(removeAll());
    return fetch(`${API}/api/staff/all`, {
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
  loginRequest,
  sessionRequest,
  logoutRequest,
  getRequest,
  getListRequest,
  insertRequest,
  modifyRequest,
  removeRequest,
  removeAllRequest,
};
