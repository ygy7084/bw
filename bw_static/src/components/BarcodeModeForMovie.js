import React from 'react';
import { Button } from 'react-bootstrap';

const styles = {
  movie: {
    textAlign: 'center',
  },
  funcButton: {
    maxWidth: '533',
    margin: '-6px auto 0px',
    borderRadius: '0',
    fontSize: '2rem',
  },
  reactivateButton: {
    maxWidth: '533',
    margin: '0px auto',
    borderRadius: '0',
    fontSize: '2rem',
  },
};
const BarcodeModeForMovie = function BarcodeModeForMovie(props) {
  return (
    <div>
      {props.customer && props.barcodeState === '촬영 완료' ?
        <Button
          bsStyle="info"
          bsSize="large"
          style={styles.reactivateButton}
          block
          onClick={props.reactivate}
        >
          재촬영</Button>
        : null
      }
      <div style={{ textAlign: 'center' }}>
        <h4>{props.barcodeState}</h4>
      </div>
      <div style={styles.movie}>
        <h3>{props.movie.name}</h3>
        <p>{props.movie.datetimeString}</p>
        <Button bsStyle='info' onClick={props.initialize}>다른 영화 선택</Button>
      </div>
      {props.customer && props.barcodeState === '촬영 완료' ?
        <div style={{ textAlign: 'center' }}>
          <h3>이름: <b>{props.customer.name}</b></h3>
          <h3>오늘 매표 현황</h3>
          {props.reservedMovieList && props.reservedMovieList.length ?
            props.reservedMovieList.map(movie => (
              <div key={movie._id}>
                <hr />
                <h4>{movie.name}</h4>
                <p>{movie.datetimeString}</p>
              </div>
            )) : <h4>없음</h4>
          }
        </div>
        : null
      }
      {props.customer && props.barcodeState === '촬영 완료' ?
        <div>
          {!props.isTickettingOK ?
            <h3 style={{ color: 'red', textAlign: 'center' }}>{props.isTickettingOK_Message}</h3>
            :
            null
          }
          <Button
            bsStyle={props.isTickettingOK ? 'success' : 'danger'}
            bsSize="large"
            style={styles.reactivateButton}
            block
            onClick={props.ticketting}
          >
            매표 진행</Button>
        </div>
        : null
      }
    </div>
  );
};

export default BarcodeModeForMovie;
