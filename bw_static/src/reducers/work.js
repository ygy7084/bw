import update from 'react-addons-update';
import {
  actions,
} from '../actions';

const initialState = {
  getList: {
    status: 'INIT',
    list: [],
  },
  insert: {
    status: 'INIT',
    work: null,
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
  excelDownload: {
    status: 'INIT',
    file: null,
  },
  bulkInsert: {
    status: 'INIT',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.WORK_GETLIST:
      return update(state, {
        getList: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.WORK_GETLIST_SUCCESS:
      return update(state, {
        getList: {
          status: { $set: 'SUCCESS' },
          list: { $set: action.list },
        },
      });
    case actions.WORK_GETLIST_FAILURE:
      return update(state, {
        getList: {
          status: { $set: 'FAILURE' },
          list: { $set: [] },
        },
      });
    case actions.WORK_INSERT:
      return update(state, {
        insert: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.WORK_INSERT_SUCCESS:
      return update(state, {
        insert: {
          status: { $set: 'SUCCESS' },
          work: { $set: action.work },
        },
      });
    case actions.WORK_INSERT_FAILURE:
      return update(state, {
        insert: {
          status: { $set: 'FAILURE' },
          work: { $set: null },
        },
      });
    case actions.WORK_MODIFY:
      return update(state, {
        modify: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.WORK_MODIFY_SUCCESS:
      return update(state, {
        modify: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.WORK_MODIFY_FAILURE:
      return update(state, {
        modify: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.WORK_REMOVE:
      return update(state, {
        remove: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.WORK_REMOVE_SUCCESS:
      return update(state, {
        remove: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.WORK_REMOVE_FAILURE:
      return update(state, {
        remove: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.WORK_REMOVEALL:
      return update(state, {
        removeAll: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.WORK_REMOVEALL_SUCCESS:
      return update(state, {
        removeAll: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.WORK_REMOVEALL_FAILURE:
      return update(state, {
        removeAll: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.WORK_EXCELDOWNLOAD:
      return update(state, {
        excelDownload: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.WORK_EXCELDOWNLOAD_SUCCESS:
      return update(state, {
        excelDownload: {
          status: { $set: 'SUCCESS' },
          file: { $set: action.file },
        },
      });
    case actions.WORK_EXCELDOWNLOAD_FAILURE:
      return update(state, {
        excelDownload: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.WORK_BULKINSERT:
      return update(state, {
        bulkInsert: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.WORK_BULKINSERT_SUCCESS:
      return update(state, {
        bulkInsert: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.WORK_BULKINSERT_FAILURE:
      return update(state, {
        bulkInsert: {
          status: { $set: 'FAILURE' },
        },
      });
    default:
      return state;
  }
};
