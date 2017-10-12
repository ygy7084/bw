import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

const ErrorModal = function ErrorModal(props) {
  return (
    <Modal show={props.toggle}>
      <ModalHeader>
        <h1>ERROR</h1>
      </ModalHeader>
      <ModalBody>
        <p>
          {props.message ? props.message : ''}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.close}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ErrorModal;
