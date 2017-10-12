import update from 'react-addons-update';
import {
  actions,
} from '../actions';

const initialState = {
  getList: {
    status: 'INIT',
    list: [],
  },
  removeAll: {
    status: 'INIT',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.HISTORY_GETLIST:
      return update(state, {
        getList: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.HISTORY_GETLIST_SUCCESS:
      return update(state, {
        getList: {
          status: { $set: 'SUCCESS' },
          list: { $set: action.list },
        },
      });
    case actions.HISTORY_GETLIST_FAILURE:
      return update(state, {
        getList: {
          status: { $set: 'FAILURE' },
          list: { $set: [] },
        },
      });
    case actions.HISTORY_REMOVEALL:
      return update(state, {
        removeAll: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.HISTORY_REMOVEALL_SUCCESS:
      return update(state, {
        removeAll: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.HISTORY_REMOVEALL_FAILURE:
      return update(state, {
        removeAll: {
          status: { $set: 'FAILURE' },
        },
      });
    default:
      return state;
  }
};
