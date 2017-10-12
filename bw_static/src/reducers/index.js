import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import staff from './staff';
import customer from './customer';
import movie from './movie';
import bus from './bus';
import history from './history';
import reservation from './reservation';
import work from './work';
import theater from './theater';

export default combineReducers({
  routing: routerReducer,
  staff,
  customer,
  movie,
  bus,
  history,
  reservation,
  work,
  theater,
});
