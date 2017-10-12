/* global fetch */
import {
  MOVIE_GETLIST,
  MOVIE_GETLIST_SUCCESS,
  MOVIE_GETLIST_FAILURE,
  MOVIE_INSERT,
  MOVIE_INSERT_SUCCESS,
  MOVIE_INSERT_FAILURE,
  MOVIE_MODIFY,
  MOVIE_MODIFY_SUCCESS,
  MOVIE_MODIFY_FAILURE,
  MOVIE_REMOVE,
  MOVIE_REMOVE_SUCCESS,
  MOVIE_REMOVE_FAILURE,
  MOVIE_REMOVEALL,
  MOVIE_REMOVEALL_SUCCESS,
  MOVIE_REMOVEALL_FAILURE,
  MOVIE_EXCEL,
  MOVIE_EXCEL_SUCCESS,
  MOVIE_EXCEL_FAILURE,
  MOVIE_BULKINSERT,
  MOVIE_BULKINSERT_SUCCESS,
  MOVIE_BULKINSERT_FAILURE,
} from './actions';

import {
  configure,
} from '../modules';

const API = configure.url;

const getList = function getList() {
  return {
    type: MOVIE_GETLIST,
  };
};
const getListSuccess = function getListSuccess(list, uniqueTheater) {
  return {
    type: MOVIE_GETLIST_SUCCESS,
    list,
    uniqueTheater,
  };
};
const getListFailure = function getListFailure(error) {
  return {
    type: MOVIE_GETLIST_FAILURE,
    error,
  };
};
const getListRequest = function getListRequest() {
  return (dispatch) => {
    dispatch(getList());
    return fetch(`${API}/api/movie`, {
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
          const sortedData = data.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
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
                for (const obj of sortedData) {
                  let found = res.data.find(d => d.code === obj.theater);
                  if (found) {
                    obj.theaterCode = obj.theater;
                    obj.theater = found.name;
                  }
                }
                let uniqueTheater = sortedData.map(obj => obj.theater);
                uniqueTheater = uniqueTheater.filter((v, i, s) => s.indexOf(v) === i);
                return dispatch(getListSuccess(sortedData, uniqueTheater));
              }
              return dispatch(getListFailure({
                error: null,
                message: '알 수 없는 오류',
              }));
            })
            .catch(e => dispatch(getListFailure(e)));
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
    type: MOVIE_INSERT,
  };
};
const insertSuccess = function insertSuccess(movie) {
  return {
    type: MOVIE_INSERT_SUCCESS,
    movie,
  };
};
const insertFailure = function insertFailure(error) {
  return {
    type: MOVIE_INSERT_FAILURE,
    error,
  };
};
const insertRequest = function insertRequest(movie) {
  return (dispatch) => {
    dispatch(insert());
    return fetch(`${API}/api/movie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: movie,
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
    type: MOVIE_MODIFY,
  };
};
const modifySuccess = function modifySuccess() {
  return {
    type: MOVIE_MODIFY_SUCCESS,
  };
};
const modifyFailure = function modifyFailure(error) {
  return {
    type: MOVIE_MODIFY_FAILURE,
    error,
  };
};
const modifyRequest = function modifyRequest(movie) {
  return (dispatch) => {
    dispatch(modify());
    return fetch(`${API}/api/movie`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: movie,
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
    type: MOVIE_REMOVE,
  };
};
const removeSuccess = function removeSuccess() {
  return {
    type: MOVIE_REMOVE_SUCCESS,
  };
};
const removeFailure = function removeFailure(error) {
  return {
    type: MOVIE_REMOVE_FAILURE,
    error,
  };
};
const removeAll = function removeAll() {
  return {
    type: MOVIE_REMOVEALL,
  };
};
const removeAllSuccess = function removeAllSuccess() {
  return {
    type: MOVIE_REMOVEALL_SUCCESS,
  };
};
const removeAllFailure = function removeAllFailure(error) {
  return {
    type: MOVIE_REMOVEALL_FAILURE,
    error,
  };
};
const removeAllRequest = function removeAllRequest() {
  return (dispatch) => {
    dispatch(removeAll());
    return fetch(`${API}/api/movie/all`, {
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
const removeRequest = function removeRequest(movie) {
  return (dispatch) => {
    dispatch(remove());
    return fetch(`${API}/api/movie`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: movie,
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
const excel = function excel() {
  return {
    type: MOVIE_EXCEL,
  };
};
const excelSuccess = function excelSuccess(parsedExcelData) {
  return {
    type: MOVIE_EXCEL_SUCCESS,
    parsedExcelData,
  };
};
const excelFailure = function excelFailure(error) {
  return {
    type: MOVIE_EXCEL_FAILURE,
    error,
  };
};
const excelRequest = function excelRequest(excelFile) {
  return (dispatch) => {
    dispatch(excel());
    const data = new FormData();
    data.append('file', excelFile);
    return fetch(`${configure.url}/api/movie/excel`, {
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
          const data = res.data;
          for (const obj of data) {
            if (obj.datetime) {
              obj.datetime = new Date(obj.datetime);
              obj.datetimeString = obj.datetime.toLocaleString();
            }
          }
          const sortedData = data.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
          return dispatch(excelSuccess(sortedData));
        }
        return dispatch(excelFailure({
          error: null,
          message: '알 수 없는 오류',
        }));
      })
      .catch(e => dispatch(excelFailure(e)));
  };
};
const bulkInsert = function bulkInsert() {
  return {
    type: MOVIE_BULKINSERT,
  };
};
const bulkInsertSuccess = function bulkInsertSuccess() {
  return {
    type: MOVIE_BULKINSERT_SUCCESS,
  };
};
const bulkInsertFailure = function bulkInsertFailure(error) {
  return {
    type: MOVIE_BULKINSERT_FAILURE,
    error,
  };
};
const bulkInsertRequest = function bulkInsertRequest(bulk) {
  return (dispatch) => {
    dispatch(bulkInsert());
    return fetch(`${API}/api/movie/bulk`, {
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
  excelRequest,
  bulkInsertRequest,
};
