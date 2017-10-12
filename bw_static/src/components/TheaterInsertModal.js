import React from 'react';
import { Button, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

class TheaterInsertModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      name: '',
    };
    this.clear = this.clear.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      this.clear();
    }
  }
  clear() {
    this.setState({
      code: '',
      name: '',
    });
  }
  handleInsert() {
    this.props.insert(this.state);
  }
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>영화관 추가</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsText">
                <ControlLabel>코드</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.code}
                  onChange={e => this.setState({ code: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>이름</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              bsStyle="success"
              bsSize="large"
              onClick={this.handleInsert}
            >추가</Button>
            <Button
              bsSize="large"
              onClick={() => {
                this.props.close();
                this.clear();
              }}
            >닫기</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default TheaterInsertModal;
