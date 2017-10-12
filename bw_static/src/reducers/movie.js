import update from 'react-addons-update';
import {
  actions,
} from '../actions';

const initialState = {
  getList: {
    status: 'INIT',
    list: [],
    uniqueTheater: [],
  },
  insert: {
    status: 'INIT',
    movie: null,
  },
  modify: {
    status: 'INIT',
  },
  remove: {
    status: 'INIT',
  },
  removeAll: {
    status: 'INIT',
  },
  excel: {
    status: 'INIT',
    parsedExcelData: [],
  },
  bulkInsert: {
    status: 'INIT',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.MOVIE_GETLIST:
      return update(state, {
        getList: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.MOVIE_GETLIST_SUCCESS:
      return update(state, {
        getList: {
          status: { $set: 'SUCCESS' },
          list: { $set: action.list },
          uniqueTheater: { $set: action.uniqueTheater },
        },
      });
    case actions.MOVIE_GETLIST_FAILURE:
      return update(state, {
        getList: {
          status: { $set: 'FAILURE' },
          list: { $set: [] },
        },
      });
    case actions.MOVIE_INSERT:
      return update(state, {
        insert: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.MOVIE_INSERT_SUCCESS:
      return update(state, {
        insert: {
          status: { $set: 'SUCCESS' },
          movie: { $set: action.movie },
        },
      });
    case actions.MOVIE_INSERT_FAILURE:
      return update(state, {
        insert: {
          status: { $set: 'FAILURE' },
          movie: { $set: null },
        },
      });
    case actions.MOVIE_MODIFY:
      return update(state, {
        modify: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.MOVIE_MODIFY_SUCCESS:
      return update(state, {
        modify: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.MOVIE_MODIFY_FAILURE:
      return update(state, {
        modify: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.MOVIE_REMOVE:
      return update(state, {
        remove: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.MOVIE_REMOVE_SUCCESS:
      return update(state, {
        remove: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.MOVIE_REMOVE_FAILURE:
      return update(state, {
        remove: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.MOVIE_REMOVEALL:
      return update(state, {
        removeAll: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.MOVIE_REMOVEALL_SUCCESS:
      return update(state, {
        removeAll: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.MOVIE_REMOVEALL_FAILURE:
      return update(state, {
        removeAll: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.MOVIE_EXCEL:
      return update(state, {
        excel: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.MOVIE_EXCEL_SUCCESS:
      return update(state, {
        excel: {
          status: { $set: 'SUCCESS' },
          parsedExcelData: { $set: action.parsedExcelData },
        },
      });
    case actions.MOVIE_EXCEL_FAILURE:
      return update(state, {
        excel: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.MOVIE_BULKINSERT:
      return update(state, {
        bulkInsert: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.MOVIE_BULKINSERT_SUCCESS:
      return update(state, {
        bulkInsert: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.MOVIE_BULKINSERT_FAILURE:
      return update(state, {
        bulkInsert: {
          status: { $set: 'FAILURE' },
        },
      });
    default:
      return state;
  }
};
