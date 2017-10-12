/* global window */
import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  Customer,
  Staff,
  Barcode,
  Realtime,
  Bus,
  Movie,
  History,
  BusRealtime,
  Reservation,
  BarcodeMovie,
  BarcodeStaff,
  Work,
  Theater,
} from './';

import {
  Header,
  Contents,
} from '../components';

class Main extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      menuClose: window.innerWidth < 768,
      menuSelected: '',
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.menuSelect = this.menuSelect.bind(this);
  }
  toggleMenu() {
    this.setState({
      menuClose: !this.state.menuClose,
    });
  }
  menuSelect(menu) {
    this.setState({
      menuSelected: menu,
      menuClose:
        window.innerWidth < 768 ? true : this.state.menuClose });
    this.props.changePage(`${menu}`);
  }
  render() {
    return (
      <div>
        <Route
          path="/"
          children={props => (
            <Header
              staff={this.props.staff}
              logout={this.props.logout}
              toggleMenu={this.toggleMenu}
              menuClose={this.state.menuClose}
              menuClick={this.menuSelect}
              {...props}
            />
          )
          }
        />
        <Contents
          menuClose={this.state.menuClose}
          barcode={this.state.menuSelected === 'barcode'}
        >
          <Switch>
            <Route path="/staff" component={Staff} />
            <Route path="/work" component={Work} />
            <Route path="/customer" component={Customer} />
            <Route path="/bus" component={Bus} />
            <Route path="/realtime" component={Realtime} />
            <Route path="/busrealtime" component={BusRealtime} />
            <Route path="/history" component={History} />
            <Route path="/movie" component={Movie} />
            <Route path="/theater" component={Theater} />
            <Route path="/reservation" component={Reservation} />
            <Route path="/barcode" component={Barcode} />
            <Route path="/barcodemovie" component={BarcodeMovie} />
            <Route path="/barcodestaff" component={BarcodeStaff} />
            <Route path="/" component={Barcode} />
          </Switch>
        </Contents>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Main);
