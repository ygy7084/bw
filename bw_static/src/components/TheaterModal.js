import React from 'react';
import { Button, ControlLabel, Form, FormGroup, FormControl, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

const styles = {
  barcode: {
    width: '100px',
    height: '100px',
    marginTop: '15px',
  },
  buttons: {
    display: 'inline-block',
    marginRight: '10px',
  },
};
class TheaterModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      name: '',
      modifyMode: false,
    };
    this.handleModify = this.handleModify.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.theater && JSON.stringify(this.props.theater) !== JSON.stringify(nextProps.theater)) {
      this.setState({
        code: nextProps.theater.code,
        name: nextProps.theater.name,
        modifyMode: false,
      });
    }
  }
  handleModify() {
    this.props.modify({
      _id: this.props.theater._id,
      code: this.state.code,
      name: this.state.name,
    });
  }
  handleRemove() {
    this.props.remove({ _id: this.props.theater._id });
  }
  render() {
    return (
      <div>
        <Modal
          show={this.props.toggle}
        >
          <ModalHeader>
            <h1>영화관 정보</h1>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup controlId="formControlsText">
                <ControlLabel>코드</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.code}
                  disabled={!this.state.modifyMode}
                  onChange={e => this.setState({ code: e.target.value })}
                />
              </FormGroup>
              <FormGroup controlId="formControlsText">
                <ControlLabel>이름</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.name}
                  disabled={!this.state.modifyMode}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            {
              this.state.modifyMode === false ?
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  onClick={() => this.setState({ modifyMode: true })}
                >수정 또는 삭제</Button> :
                <div style={styles.buttons}>
                  <Button
                    bsStyle="info"
                    bsSize="large"
                    onClick={this.handleModify}
                  >수정</Button>
                  <Button
                    bsStyle="warning"
                    bsSize="large"
                    onClick={this.handleRemove}
                  >삭제</Button>
                </div>
            }
            <Button bsSize="large" onClick={this.props.close}>닫기</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TheaterModal;
