/* global fetch */ // FOR ESLINT
import {
  HISTORY_GETLIST,
  HISTORY_GETLIST_SUCCESS,
  HISTORY_GETLIST_FAILURE,
  HISTORY_REMOVEALL,
  HISTORY_REMOVEALL_SUCCESS,
  HISTORY_REMOVEALL_FAILURE,
} from './actions';

import {
  configure,
} from '../modules';

const API = configure.url;

const getList = function getList() {
  return {
    type: HISTORY_GETLIST,
  };
};
const getListSuccess = function getListSuccess(list) {
  return {
    type: HISTORY_GETLIST_SUCCESS,
    list,
  };
};
const getListFailure = function getListFailure(error) {
  return {
    type: HISTORY_GETLIST_FAILURE,
    error,
  };
};
const getListRequest = function getListRequest() {
  return (dispatch) => {
    dispatch(getList());
    return fetch(`${API}/api/history`, {
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
const removeAll = function removeAll() {
  return {
    type: HISTORY_REMOVEALL,
  };
};
const removeAllSuccess = function removeAllSuccess() {
  return {
    type: HISTORY_REMOVEALL_SUCCESS,
  };
};
const removeAllFailure = function removeAllFailure(error) {
  return {
    type: HISTORY_REMOVEALL_FAILURE,
    error,
  };
};
const removeAllRequest = function removeAllRequest() {
  return (dispatch) => {
    dispatch(removeAll());
    return fetch(`${API}/api/history`, {
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
  removeAllRequest,
};
