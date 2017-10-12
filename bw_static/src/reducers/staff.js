import update from 'react-addons-update';
import {
  actions,
} from '../actions';

const initialState = {
  login: {
    status: 'INIT',
  },
  session: {
    status: 'INIT',
    staff: null,
  },
  logout: {
    status: 'INIT',
  },
  get: {
    status: 'INIT',
    staff: null,
  },
  getList: {
    status: 'INIT',
    list: [],
  },
  insert: {
    status: 'INIT',
    staff: null,
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
    case actions.STAFF_LOGIN:
      return update(state, {
        login: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_LOGIN_SUCCESS:
      return update(state, {
        login: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.STAFF_LOGIN_FAILURE:
      return update(state, {
        login: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.STAFF_SESSION:
      return update(state, {
        session: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_SESSION_SUCCESS:
      return update(state, {
        session: {
          status: { $set: 'SUCCESS' },
          staff: { $set: action.staff },
        },
      });
    case actions.STAFF_SESSION_FAILURE:
      return update(state, {
        session: {
          status: { $set: 'FAILURE' },
          staff: { $set: null },
        },
      });
    case actions.STAFF_LOGOUT:
      return update(state, {
        logout: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_LOGOUT_SUCCESS:
      return update(state, {
        logout: {
          status: { $set: 'SUCCESS' },
        },
        session: {
          staff: { $set: null },
        },
      });
    case actions.STAFF_LOGOUT_FAILURE:
      return update(state, {
        logout: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.STAFF_GET:
      return update(state, {
        get: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_GET_SUCCESS:
      return update(state, {
        get: {
          status: { $set: 'SUCCESS' },
          staff: { $set: action.staff },
        },
      });
    case actions.STAFF_GET_FAILURE:
      return update(state, {
        get: {
          status: { $set: 'FAILURE' },
          staff: { $set: null },
        },
      });
    case actions.STAFF_GETLIST:
      return update(state, {
        getList: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_GETLIST_SUCCESS:
      return update(state, {
        getList: {
          status: { $set: 'SUCCESS' },
          list: { $set: action.list },
        },
      });
    case actions.STAFF_GETLIST_FAILURE:
      return update(state, {
        getList: {
          status: { $set: 'FAILURE' },
          list: { $set: [] },
        },
      });
    case actions.STAFF_INSERT:
      return update(state, {
        insert: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_INSERT_SUCCESS:
      return update(state, {
        insert: {
          status: { $set: 'SUCCESS' },
          staff: { $set: action.staff },
        },
      });
    case actions.STAFF_INSERT_FAILURE:
      return update(state, {
        insert: {
          status: { $set: 'FAILURE' },
          staff: { $set: null },
        },
      });
    case actions.STAFF_MODIFY:
      return update(state, {
        modify: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_MODIFY_SUCCESS:
      return update(state, {
        modify: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.STAFF_MODIFY_FAILURE:
      return update(state, {
        modify: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.STAFF_REMOVE:
      return update(state, {
        remove: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_REMOVE_SUCCESS:
      return update(state, {
        remove: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.STAFF_REMOVE_FAILURE:
      return update(state, {
        remove: {
          status: { $set: 'FAILURE' },
        },
      });
    case actions.STAFF_REMOVEALL:
      return update(state, {
        removeAll: {
          status: { $set: 'WAITING' },
        },
      });
    case actions.STAFF_REMOVEALL_SUCCESS:
      return update(state, {
        removeAll: {
          status: { $set: 'SUCCESS' },
        },
      });
    case actions.STAFF_REMOVEALL_FAILURE:
      return update(state, {
        removeAll: {
          status: { $set: 'FAILURE' },
        },
      });
    default:
      return state;
  }
};
