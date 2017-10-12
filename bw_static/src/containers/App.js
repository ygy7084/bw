import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import { loader } from '../modules';
import {
  staff,
} from '../actions';
import {
  Main,
} from './';
import {
  Entry,
} from '../components';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.loginRequest = this.loginRequest.bind(this);
    this.logoutRequest = this.logoutRequest.bind(this);
  }
  componentWillMount(){
    this.props.staffSessionRequest()
      .then(() => {
        loader.off();
        this.props.changePage(`${this.props.location.pathname}`);
      })
      .catch(() => {
        loader.off();
      });
  }
  loginRequest(sn) {
    loader.on();
    return this.props.staffLoginRequest(sn)
      .then(() => {
        if (this.props.staffLogin.status === 'SUCCESS') {
          this.props.staffSessionRequest()
            .then(() => {
              loader.off();
              this.props.changePage('/main');
            })
            .catch(() => {
              loader.off();
            });
        } else if (this.props.staffLogin.status === 'FAILURE') {
          loader.off();
        }
      })
      .catch(() => {
        loader.off();
      });
  }
  logoutRequest() {
    loader.on();
    return this.props.staffLogoutRequest()
      .then(() => {
        if (this.props.staffLogout.status === 'SUCCESS') {
          this.props.staffSessionRequest()
            .then(() => {
              loader.off();
              this.props.changePage('/login');
            })
            .catch(() => {
              loader.off();
            });
        } else if (this.props.staffLogoutRequest === 'FAILURE') {
          loader.off();
        }
      })
      .catch(() => {
        loader.off();
      });
  }
  render() {
    return (
      <div>
        <Switch>
          <Route
            path="/login"
            render={props => (
              this.props.staffSession.status === 'SUCCESS' ?
                <Redirect to={{
                  pathname: '/',
                  state: { from: props.location },
                }}
                />
                :
                <Entry
                  staff={this.props.staffSession.staff}
                  success={this.props.staffLogin.status}
                  login={this.loginRequest}
                  {...props}
                />
            )}
          />
          <Route
            path="/"
            render={props => (
              this.props.staffSession.status === 'SUCCESS' ? (
                <Main
                  logout={this.logoutRequest}
                  staff={this.props.staffSession.staff}
                  {...props}
                />
              ) :
                this.props.staffSession.status === 'FAILURE' ? (
                  <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location },
                  }}
                  />
                )
                  : (
                    null
                  )
            )}
          />
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  staffLogin: {
    status: state.staff.login.status,
  },
  staffSession: {
    status: state.staff.session.status,
    staff: state.staff.session.staff,
  },
  staffLogout: {
    status: state.staff.logout.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  staffLoginRequest: staff.loginRequest,
  staffSessionRequest: staff.sessionRequest,
  staffLogoutRequest: staff.logoutRequest,
  changePage: path => push(path),
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
