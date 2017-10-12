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
    theater: null,
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
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.THEATER_GETLIST:
      return update(state, {
        getList: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.THEATER_GETLIST_SUCCESS:
      return update(state, {
        getList: {
          status: { $set: 'SUCCESS' },
          list: { $set: action.list },
        },
      });
    case actions.THEATER_GETLIST_FAILURE:
      return update(state, {
        getList: {
          status: { $set: 'FAILURE' },
          list: { $set: [] },
        },
      });
    case actions.THEATER_INSERT:
      return update(state, {
        insert: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.THEATER_INSERT_SUCCESS:
      return update(state, {
        insert: {
          status: { $set: 'SUCCESS' },
          theater: { $set: action.theater },
        },
      });
    case actions.THEATER_INSERT_FAILURE:
      return update(state, {
        insert: {
          status: { $set: 'FAILURE' },
          theater: { $set: null },
        },
      });
    case actions.THEATER_MODIFY:
      return update(state, {
        modify: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.THEATER_MODIFY_SUCCESS:
      return update(state, {
        modify: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.THEATER_MODIFY_FAILURE:
      return update(state, {
        modify: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.THEATER_REMOVE:
      return update(state, {
        remove: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.THEATER_REMOVE_SUCCESS:
      return update(state, {
        remove: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.THEATER_REMOVE_FAILURE:
      return update(state, {
        remove: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.THEATER_REMOVEALL:
      return update(state, {
        removeAll: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.THEATER_REMOVEALL_SUCCESS:
      return update(state, {
        removeAll: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.THEATER_REMOVEALL_FAILURE:
      return update(state, {
        removeAll: {
          status: { $set: 'FAILURE' },
        },
      });
    default:
      return state;
  }
};
