/* global fetch */
import {
  RESERVATION_GETLIST,
  RESERVATION_GETLIST_SUCCESS,
  RESERVATION_GETLIST_FAILURE,
  RESERVATION_INSERT,
  RESERVATION_INSERT_SUCCESS,
  RESERVATION_INSERT_FAILURE,
  RESERVATION_REMOVE,
  RESERVATION_REMOVE_SUCCESS,
  RESERVATION_REMOVE_FAILURE,
  RESERVATION_REMOVEALL,
  RESERVATION_REMOVEALL_SUCCESS,
  RESERVATION_REMOVEALL_FAILURE,
} from './actions';

import {
  configure,
} from '../modules';

const API = configure.url;

const getList = function getList() {
  return {
    type: RESERVATION_GETLIST,
  };
};
const getListSuccess = function getListSuccess(list) {
  return {
    type: RESERVATION_GETLIST_SUCCESS,
    list,
  };
};
const getListFailure = function getListFailure(error) {
  return {
    type: RESERVATION_GETLIST_FAILURE,
    error,
  };
};
const getListRequest = function getListRequest() {
  return (dispatch) => {
    dispatch(getList());
    return fetch(`${API}/api/reservation`, {
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
            if (obj.movie && obj.movie.datetime) {
              obj.movie.datetime = new Date(obj.movie.datetime);
              obj.movie.datetimeString = obj.movie.datetime.toLocaleString();
            } else {
              data.splice(data.findIndex(datum => datum._id === obj._id), 1);
            }
          }
          const sortedData = data.sort((a, b) =>
            b.movie.datetime.getTime() - a.movie.datetime.getTime(),
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
    type: RESERVATION_INSERT,
  };
};
const insertSuccess = function insertSuccess(reservation) {
  return {
    type: RESERVATION_INSERT_SUCCESS,
    reservation,
  };
};
const insertFailure = function insertFailure(error) {
  return {
    type: RESERVATION_INSERT_FAILURE,
    error,
  };
};
const insertRequest = function insertRequest(reservation) {
  return (dispatch) => {
    dispatch(insert());
    return fetch(`${API}/api/reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: reservation,
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
const remove = function remove() {
  return {
    type: RESERVATION_REMOVE,
  };
};
const removeSuccess = function removeSuccess() {
  return {
    type: RESERVATION_REMOVE_SUCCESS,
  };
};
const removeFailure = function removeFailure(error) {
  return {
    type: RESERVATION_REMOVE_FAILURE,
    error,
  };
};
const removeRequest = function removeRequest(reservation) {
  return (dispatch) => {
    dispatch(remove());
    return fetch(`${API}/api/reservation`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: reservation,
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
    type: RESERVATION_REMOVEALL,
  };
};
const removeAllSuccess = function removeAllSuccess() {
  return {
    type: RESERVATION_REMOVEALL_SUCCESS,
  };
};
const removeAllFailure = function removeAllFailure(error) {
  return {
    type: RESERVATION_REMOVEALL_FAILURE,
    error,
  };
};
const removeAllRequest = function removeAllRequest() {
  return (dispatch) => {
    dispatch(removeAll());
    return fetch(`${API}/api/reservation/all`, {
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
  removeRequest,
  removeAllRequest,
};
