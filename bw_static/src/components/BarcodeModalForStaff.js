import React from 'react';
import { Button, ButtonGroup, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

const styles = {
  select: {
    fontSize: '30px',
    height: '60px',
  },
  selectName: {
    fontSize: '20px',
  },
  button1: {
    margin: '0px',
    padding: '10px',
  },
  button2: {
    margin: '0px',
    marginTop: '7px',
    padding: '10px',
  },
};
class BarcodeModalForStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: '조회',
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({ mode: e.target.value });
  }
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
          animation={false}
        >
          <ModalHeader>
            <h1>기능 선택</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsText">
                <ControlLabel style={styles.selectName}>출퇴근 관리</ControlLabel>
                <FormControl
                  componentClass="select"
                  style={styles.select}
                  onChange={this.handleChange}
                  value={this.state.mode}
                >
                  <option value="조회">조회</option>
                  <option value="출근">출근</option>
                  <option value="퇴근">퇴근</option>
                </FormControl>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup vertical block>
              <Button
                bsStyle="primary"
                bsSize="large"
                style={styles.button1}
                onClick={() => this.props.select(this.state.mode)}
              >확인</Button>
              <Button
                onClick={this.props.close}
                style={styles.button2}
              >닫기</Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default BarcodeModalForStaff;
