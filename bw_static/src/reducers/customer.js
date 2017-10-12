import update from 'react-addons-update';
import {
  actions,
} from '../actions';

const initialState = {
  get: {
    status: 'INIT',
    customer: null,
  },
  getList: {
    status: 'INIT',
    list: [],
  },
  insert: {
    status: 'INIT',
    customer: null,
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
    case actions.CUSTOMER_GET:
      return update(state, {
        get: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_GET_SUCCESS:
      return update(state, {
        get: {
          status: { $set: 'SUCCESS' },
          customer: { $set: action.customer },
        },
      });
    case actions.CUSTOMER_GET_FAILURE:
      return update(state, {
        get: {
          status: { $set: 'FAILURE' },
          customer: { $set: null },
        },
      });
    case actions.CUSTOMER_GETLIST:
      return update(state, {
        getList: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_GETLIST_SUCCESS:
      return update(state, {
        getList: {
          status: { $set: 'SUCCESS' },
          list: { $set: action.list },
        },
      });
    case actions.CUSTOMER_GETLIST_FAILURE:
      return update(state, {
        getList: {
          status: { $set: 'FAILURE' },
          list: { $set: [] },
        },
      });
    case actions.CUSTOMER_INSERT:
      return update(state, {
        insert: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_INSERT_SUCCESS:
      return update(state, {
        insert: {
          status: { $set: 'SUCCESS' },
          customer: { $set: action.customer },
        },
      });
    case actions.CUSTOMER_INSERT_FAILURE:
      return update(state, {
        insert: {
          status: { $set: 'FAILURE' },
          customer: { $set: null },
        },
      });
    case actions.CUSTOMER_MODIFY:
      return update(state, {
        modify: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_MODIFY_SUCCESS:
      return update(state, {
        modify: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.CUSTOMER_MODIFY_FAILURE:
      return update(state, {
        modify: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.CUSTOMER_REMOVE:
      return update(state, {
        remove: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_REMOVE_SUCCESS:
      return update(state, {
        remove: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.CUSTOMER_REMOVE_FAILURE:
      return update(state, {
        remove: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.CUSTOMER_REMOVEALL:
      return update(state, {
        removeAll: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_REMOVEALL_SUCCESS:
      return update(state, {
        removeAll: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.CUSTOMER_REMOVEALL_FAILURE:
      return update(state, {
        removeAll: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.CUSTOMER_EXCEL:
      return update(state, {
        excel: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_EXCEL_SUCCESS:
      return update(state, {
        excel: {
          status: { $set: 'SUCCESS' },
          parsedExcelData: { $set: action.parsedExcelData },
        },
      });
    case actions.CUSTOMER_EXCEL_FAILURE:
      return update(state, {
        excel: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.CUSTOMER_EXCELDOWNLOAD:
      return update(state, {
        excelDownload: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_EXCELDOWNLOAD_SUCCESS:
      return update(state, {
        excelDownload: {
          status: { $set: 'SUCCESS' },
          file: { $set: action.file },
        },
      });
    case actions.CUSTOMER_EXCELDOWNLOAD_FAILURE:
      return update(state, {
        excelDownload: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.CUSTOMER_BULKINSERT:
      return update(state, {
        bulkInsert: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.CUSTOMER_BULKINSERT_SUCCESS:
      return update(state, {
        bulkInsert: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.CUSTOMER_BULKINSERT_FAILURE:
      return update(state, {
        bulkInsert: {
          status: { $set: 'FAILURE' },
        },
      });
    default:
      return state;
  }
};
