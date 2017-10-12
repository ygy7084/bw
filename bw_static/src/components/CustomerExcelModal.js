/* global document */
import React from 'react';
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
class CustomerExcelModal extends React.Component {
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>고객 엑셀 입력</h1>
          </ModalHeader>
          <ModalBody>
            <Alert bsStyle="info">
              <strong>참고!</strong> 엑셀 입력은 실시간 연동이 안됩니다. 현재 실시간 페이지를 조회 중이라면 입력 후 실시간 페이지를 새로고침하세요.
            </Alert>
            <Alert bsStyle="info">
              <strong>참고!</strong> 버스 입출경을 진행하려면 엑셀의 버스 호차가 반드시 버스 메뉴를 통해 수동으로 입력되어야 합니다.
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
                  <th style={[styles.table_th.base]}>호차</th>
                  <th style={[styles.table_th.base]}>이름</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.parsedExcelData.map((item, i) =>
                    (
                      <tr
                        key={`${item.bus}${item.name}`}
                        style={styles.table_tr}
                      >
                        <td>{i + 1}</td>
                        <td>{item.bus}</td>
                        <td>{item.name}</td>
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
                onClick={() => this.props.customerBulkInsert(this.props.parsedExcelData)}
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

export default CustomerExcelModal;
