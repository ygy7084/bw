/* global document */
import React from 'react';
import Radium from 'radium';
import { Button, Alert, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

const styles = {
  table: {
    margin: 'auto',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  table_th: {
    base: {
      textAlign: 'center',
    },
    datetime: {
      width: '25%',
    },
  },
  tabel_tr_td: {
    padding: '1rem',
  },
  table_tr: {
  },
  buttons: {
    display: 'inline-block',
    marginRight: '10px',
  },
};
class MovieExcelModal extends React.Component {
  render() {
    let list = this.props.parsedExcelData;
    return (
      <div>
        <Modal
          show={this.props.toggle}
          bsSize="large"
        >
          <ModalHeader>
            <h1>영화 엑셀 입력</h1>
          </ModalHeader>
          <ModalBody>
            <Alert bsStyle="info">
              <strong>참고!</strong> 엑셀 입력은 실시간 연동이 안됩니다. 현재 실시간 페이지를 조회 중이라면 입력 후 실시간 페이지를 새로고침하세요.
            </Alert>
            <Table
              style={styles.table}
              striped
              bordered
              hover
            >
              <thead>
                <tr>
                  <th style={[styles.table_th.base]}>번호</th>
                  <th style={[styles.table_th.base]}>제목</th>
                  <th style={[styles.table_th.base]}>상영관</th>
                  <th style={[styles.table_th.base]}>총 좌석</th>
                  <th style={[styles.table_th.base, styles.table_th.datetime]}>상영시각</th>
                </tr>
              </thead>
              <tbody>
                {
                  list.map((item, i) =>
                    (
                      <tr
                        key={`${item.name}${item.datetime.getTime()}`}
                        style={styles.table_tr}
                      >
                        <td>{i + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.theater}</td>
                        <td>{item.available}</td>
                        <td>{item.datetime.toLocaleString()}</td>
                      </tr>
                    ))
                }
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <div style={styles.buttons}>
              <Button
                bsStyle="info"
                bsSize="large"
                onClick={() => this.props.movieBulkInsert(this.props.parsedExcelData)}
              >입력</Button>
              <Button
                bsSize="large"
                onClick={this.props.close}
              >닫기</Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Radium(MovieExcelModal);
