import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  movie,
} from '../actions';

import {
  MovieList,
  MovieModal,
  MovieInsertModal,
  MovieExcelModal,
  RemoveModal,
  ErrorModal,
} from '../components';

import {
  loader,
} from '../modules';

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieModalToggle: false,
      movieModalItem: null,
      movieInsertModalToggle: false,
      movieExcelModalToggle: false,
      movieRemoveAllModalToggle: false,
      errorMessage: '',
      errorModalToggle: false,
    };
    this.errorHandle = this.errorHandle.bind(this);
    this.movieLoad = this.movieLoad.bind(this);
    this.movieClick = this.movieClick.bind(this);
    this.movieInsertClick = this.movieInsertClick.bind(this);
    this.movieInsert = this.movieInsert.bind(this);
    this.movieExcel = this.movieExcel.bind(this);
    this.movieBulkInsert = this.movieBulkInsert.bind(this);
    this.movieModify = this.movieModify.bind(this);
    this.movieRemove = this.movieRemove.bind(this);
    this.movieRemoveAll = this.movieRemoveAll.bind(this);
    this.movieRemoveAllClick = this.movieRemoveAllClick.bind(this);

  }
  componentWillMount() {
    this.movieLoad();
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
      movieModalToggle: true,
      movieModalItem: movie,
    });
  }
  movieInsertClick() {
    this.setState({
      movieInsertModalToggle: true,
    });
  }
  movieInsert(movie) {
    loader.on();
    this.props.movieInsertRequest(movie)
      .then((data) => {
        if (this.props.movieInsert.status === 'SUCCESS') {
          this.setState({ movieInsertModalToggle: false });
          this.movieLoad();
        } else if (this.props.movieInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  movieExcel(excelFile) {
    loader.on();
    this.props.movieExcelRequest(excelFile)
      .then((data) => {
        if (this.props.movieExcel.status === 'SUCCESS') {
          loader.off();
          this.setState({
            movieInsertModalToggle: false,
            movieExcelModalToggle: true,
          });
        } else if (this.props.movieExcel.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  movieBulkInsert(bulk) {
    loader.on();
    this.props.movieBulkInsertRequest(bulk)
      .then((data) => {
        if (this.props.movieBulkInsert.status === 'SUCCESS') {
          this.setState({
            movieExcelModalToggle: false,
          });
          this.movieLoad();
        } else if (this.props.movieBulkInsert.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  movieModify(movie) {
    loader.on();
    this.props.movieModifyRequest(movie, this.props.staffSession.staff)
      .then((data) => {
        if (this.props.movieModify.status === 'SUCCESS') {
          this.setState({ movieModalToggle: false });
          this.movieLoad();
        } else if (this.props.movieModify.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  movieRemove(movieId) {
    loader.on();
    this.props.movieRemoveRequest(movieId)
      .then((data) => {
        if (this.props.movieRemove.status === 'SUCCESS') {
          this.setState({ movieModalToggle: false });
          this.movieLoad();
        } else if (this.props.movieRemove.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  movieRemoveAll() {
    loader.on();
    this.props.movieRemoveAllRequest()
      .then((data) => {
        if (this.props.movieRemoveAll.status === 'SUCCESS') {
          this.setState({ movieRemoveAllModalToggle: false });
          this.movieLoad();
        } else if (this.props.movieRemoveAll.status === 'FAILURE') {
          loader.off();
          throw data;
        }
      })
      .catch((data) => {
        loader.off();
        this.errorHandle(data);
      });
  }
  movieRemoveAllClick() {
    this.setState({
      movieRemoveAllModalToggle: true,
    });
  }
  render() {
    return (
      <div>
        <MovieList
          movieClick={this.movieClick}
          movieInsertClick={this.movieInsertClick}
          movieRemoveAllClick={this.movieRemoveAllClick}
          list={this.props.movieGetList.list}
          refresh={this.movieLoad}
        />
        <MovieModal
          toggle={this.state.movieModalToggle}
          close={() => this.setState({ movieModalItem: null, movieModalToggle: false })}
          movie={this.state.movieModalItem}
          modify={this.movieModify}
          remove={this.movieRemove}
        />
        <MovieInsertModal
          toggle={this.state.movieInsertModalToggle}
          close={() => this.setState({ movieInsertModalToggle: false })}
          insert={this.movieInsert}
          movieExcel={this.movieExcel}
        />
        <MovieExcelModal
          toggle={this.state.movieExcelModalToggle}
          close={() => this.setState({ movieExcelModalToggle: false })}
          parsedExcelData={this.props.movieExcel.parsedExcelData}
          movieBulkInsert={this.movieBulkInsert}
        />
        <RemoveModal
          toggle={this.state.movieRemoveAllModalToggle}
          title="주의! 리스트를 전부 삭제합니다."
          subtitle="영화 리스트가 전부 삭제됩니다."
          handleRemove={this.movieRemoveAll}
          handleClose={() => this.setState({ movieRemoveAllModalToggle: false })}
        />
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
  },
  movieInsert: {
    status: state.movie.insert.status,
    movie: state.movie.insert.movie,
  },
  movieModify: {
    status: state.movie.modify.status,
  },
  movieRemove: {
    status: state.movie.remove.status,
  },
  movieRemoveAll: {
    status: state.movie.removeAll.status,
  },
  movieExcel: {
    status: state.movie.excel.status,
    parsedExcelData: state.movie.excel.parsedExcelData,
  },
  movieBulkInsert: {
    status: state.movie.bulkInsert.status,
  },
});
const mapDispatchToProps = dispatch => bindActionCreators({
  movieGetListRequest: movie.getListRequest,
  movieInsertRequest: movie.insertRequest,
  movieModifyRequest: movie.modifyRequest,
  movieRemoveRequest: movie.removeRequest,
  movieRemoveAllRequest: movie.removeAllRequest,
  movieExcelRequest: movie.excelRequest,
  movieBulkInsertRequest: movie.bulkInsertRequest,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Movie);
