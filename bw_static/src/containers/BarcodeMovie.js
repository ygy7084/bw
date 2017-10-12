/* global window */
import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  movie,
  reservation,
  customer,
} from '../actions';

import {
  MovieListForBarcode,
  BarcodeModeForMovie,
  BarcodeScanner,
  ErrorModal,
} from '../components';
import barcode from './webqr';
import {
  loader,
} from '../modules';

class BarcodeMovie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTickettingOK: false,
      isTickettingOK_Message: '',
      selectedMovie: null,
      barcodeState: null,
      reservationList: [],
      reservedMovieList: [],
      errorMessage: '',
      errorModalToggle: false,
    };
    this.errorHandle = this.errorHandle.bind(this);
    this.initialize = this.initialize.bind(this);
    this.makeReservedMovieList = this.makeReservedMovieList.bind(this);
    this.loadReservavtion = this.loadReservavtion.bind(this);
    this.movieLoad = this.movieLoad.bind(this);
    this.movieClick = this.movieClick.bind(this);
    this.activateBarcodeReader = this.activateBarcodeReader.bind(this);
    this.activateBarcodeReaderAgain = this.activateBarcodeReaderAgain.bind(this);
    this.customerFind = this.customerFind.bind(this);
    this.reservationInsert = this.reservationInsert.bind(this);
  }
  componentWillMount() {
    this.movieLoad();
    this.loadReservavtion();
  }
  initialize() {
    this.activateBarcodeReader(null, null);
    this.setState({
      isTickettingOK: false,
      isTickettingOK_Message: '',
      selectedMovie: null,
      barcodeState: null,
      reservationList: [],
      reservedMovieList: [],
      errorMessage: '',
      errorModalToggle: false,
    });
    this.movieLoad();
    this.loadReservavtion();
  }
  componentWillUnmount() {
    this.activateBarcodeReader(null, null);
  }
  loadReservavtion() {
    loader.on();
    this.props.reservationGetListRequest()
      .then((data) => {
        if (this.props.reservationGetList.status === 'SUCCESS') {
          loader.off();
          this.setState({
            reservationList: this.props.reservationGetList.list,
          });
        } else if (this.props.reservationGetList.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  movieLoad() {
    loader.on();
    this.props.movieGetListRequest()
      .then((data) => {
        if (this.props.movieGetList.status === 'SUCCESS') {
          loader.off();
        } else if (this.props.movieGetList.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  activateBarcodeReader(cb, state) {
    /*
    barcode(null)은 바코드 리더를 종료시킨다.
    이 코드는 종료 시킨 후 다시 실행하는 코드이다.
     */
    barcode(null);
    if (cb) {
      loader.on();
      setTimeout(() => {
        barcode(cb);
        loader.off();
        this.setState({ barcodeState: state });
      }, 400);
    } else if (state) {
      this.setState({ barcodeState: state });
    } else {
      this.setState({ barcodeState: '대기' });
    }
  }
  activateBarcodeReaderAgain(state) {
    this.activateBarcodeReader(barcode_id => {
      this.customerFind(barcode_id);
    }, state);
  }
  makeReservedMovieList() {
    loader.on();
    const list = this.state.reservationList.filter(reservation =>
      reservation.customer._id
      === this.props.customerGet.customer._id
      &&
      new Date(reservation.movie.datetime).toLocaleDateString()
      === new Date(this.state.selectedMovie.datetime).toLocaleDateString(),
    )
      .map(obj => obj.movie)
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    const reservedNum = this.state.reservationList.filter(reservation => reservation.movie._id === this.state.selectedMovie._id).length;
    if(list.length > 3) {
      this.setState({
        reservedMovieList: list,
        isTickettingOK: false,
        isTickettingOK_Message: '이미 4회의 예매를 하였습니다.',
      });
    } else if(reservedNum > ((this.state.selectedMovie.available * 15) / 100)) {
      this.setState({
        reservedMovieList: list,
        isTickettingOK: false,
        isTickettingOK_Message: '이미 해당 영화의 15% 이상이 예매가 되었습니다.',
      });
    } else {
      this.setState({
        reservedMovieList: list,
        isTickettingOK: true,
      });
    }
    loader.off();
  }
  customerFind(barcode_id) {
    this.props.customerGetRequest(barcode_id)
      .then((data) => {
        if (this.props.customerGet.status === 'SUCCESS') {
          loader.on();
          this.props.reservationGetListRequest()
            .then((data) => {
              if (this.props.reservationGetList.status === 'SUCCESS') {
                this.loadReservavtion();
                this.activateBarcodeReader(null, '촬영 완료');
                this.makeReservedMovieList();
                window.scrollTo(0, 1000);
              } else if (this.props.reservationGetList.status === 'FAILURE') {
                loader.off();
                throw data;
              }
            })
            .catch((data) => {
              loader.off();
              this.errorHandle(data);
            });
        } else if (this.props.customerGet.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((e) => {
        console.log(e);
        this.activateBarcodeReaderAgain('인식 오류 - 재촬영 중');
      });
  }
  errorHandle(data) {
    const error = data.error || data;
    if (error.message && error.message !== '') {
      const message = error.message;
      this.setState({
        errorMessage: message,
        errorModalToggle: true,
      });
      throw error.error;
    } else {
      this.setState({
        errorModalToggle: true,
      });
      throw error;
    }
  }
  movieClick(movie) {
    this.setState({
      selectedMovie: movie,
    });
    loader.on();
    setTimeout(() => {
      this.activateBarcodeReader(barcode_id => {
        this.customerFind(barcode_id);
      }, '촬영 중');
      loader.off();
    }, 1500);
  }
  reservationInsert() {
    this.props.reservationInsertRequest({
      customer: this.props.customerGet.customer,
      staff: this.props.staffSession.staff,
      movie: this.state.selectedMovie,
    })
      .then((data) => {
        if (this.props.reservationInsert.status === 'SUCCESS') {
          this.loadReservavtion();
          this.activateBarcodeReader(barcode_id => {
            this.customerFind(barcode_id);
          }, '촬영 중');
          loader.off();
        } else if (this.props.reservationInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((e) => {
        if (e.error && e.error.message) {
          loader.off();
          this.errorHandle(e.error);
        } else {
          console.log(e);
          this.activateBarcodeReaderAgain('인식 오류 - 재촬영 중');
        }
      });
  }
  render() {
    return (
      <div>
        {
          this.state.selectedMovie ?
            <div>
              <BarcodeScanner />
              <BarcodeModeForMovie
                initialize={this.initialize}
                ticketting={this.reservationInsert}
                isTickettingOK={this.state.isTickettingOK}
                isTickettingOK_Message={this.state.isTickettingOK_Message}
                barcodeState={this.state.barcodeState}
                movie={this.state.selectedMovie}
                reservedMovieList={this.state.reservedMovieList}
                customer={this.props.customerGet.customer}
                reactivate={() => this.activateBarcodeReaderAgain('촬영 중')}
              />
            </div>
            :
            <MovieListForBarcode
              movieClick={this.movieClick}
              list={this.props.movieGetList.list.filter(obj => (new Date(obj.datetime).getTime() + (1000 * 60 * 5)) > new Date().getTime())}
              uniqueTheater={this.props.movieGetList.uniqueTheater}
              refresh={this.movieLoad}
            />
        }
        <ErrorModal
          toggle={this.state.errorModalToggle}
          close={() => this.setState({ errorModalToggle: false })}
          message={this.state.errorMessage}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  staffSession: {
    status: state.staff.session.status,
    staff: state.staff.session.staff,
  },
  movieGetList: {
    status: state.movie.getList.status,
    list: state.movie.getList.list,
    uniqueTheater: state.movie.getList.uniqueTheater,
  },
  reservationGetList: {
    status: state.reservation.getList.status,
    list: state.reservation.getList.list,
  },
  reservationInsert: {
    status: state.reservation.insert.status,
    reservation: state.reservation.insert.reservation,
  },
  customerGet: {
    status: state.customer.get.status,
    customer: state.customer.get.customer,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  movieGetListRequest: movie.getListRequest,
  reservationGetListRequest: reservation.getListRequest,
  reservationInsertRequest: reservation.insertRequest,
  customerGetRequest: customer.getRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BarcodeMovie);
