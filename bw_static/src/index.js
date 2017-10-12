/* global document, window */
import 'isomorphic-fetch'; // explorer 호환
import 'babel-polyfill'; // explorer
import Promise from 'promise-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import {
  Route,
} from 'react-router-dom';
import {
  App,
} from './containers';
import registerServiceWorker from './registerServiceWorker';


if (!window.Promise) {
  window.Promise = Promise;
} // Promise explorer 호환

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route path="/" component={App} />
      </div>
    </ConnectedRouter>
  </Provider>,
  target,
);
registerServiceWorker();
