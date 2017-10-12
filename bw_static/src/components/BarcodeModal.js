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
class BarcodeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: '조회',
      bus: 1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBusChange = this.handleBusChange.bind(this);
  }
  handleChange(e) {
    this.setState({ mode: e.target.value });
  }
  handleBusChange(e) {
    this.setState({ bus: e.target.value });
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
                <ControlLabel style={styles.selectName}>고객 상태 변경</ControlLabel>
                <FormControl
                  componentClass="select"
                  style={styles.select}
                  onChange={this.handleChange}
                  value={this.state.mode}
                >
                  <option value="조회">조회</option>
                  <option value="미교부">미교부</option>
                  <option value="교부">교부</option>
                  <option value="입경탑승">입경탑승</option>
                  <option value="입경">입경</option>
                  <option value="출경탑승">출경탑승</option>
                  <option value="출경">출경</option>
                </FormControl>
              </FormGroup>
              {
                this.state.mode === '입경탑승' || this.state.mode === '출경탑승' ?
                  (<FormGroup controlId="formControlsText">
                    <ControlLabel style={styles.selectName}>버스 선택</ControlLabel>
                    <FormControl
                      componentClass="select"
                      style={styles.select}
                      onChange={this.handleBusChange}
                      value={this.state.bus}
                    >
                      {
                        this.props.bus.map((bus) => {
                          return (
                            <option key={bus} value={bus}>{bus}</option>
                          )
                        })
                      }
                    </FormControl>
                  </FormGroup>)
                  :
                  null
              }
            </Form>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup vertical block>
              <Button
                bsStyle="primary"
                bsSize="large"
                style={styles.button1}
                onClick={() => this.props.select(this.state)}
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


export default BarcodeModal;
