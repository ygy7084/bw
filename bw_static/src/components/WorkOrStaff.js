import React from 'react';
import {
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap';

const styles = {
  buttons: {
    marginBottom: '1rem',
  },
};
const WorkOrStaff = function WorkOrStaff(props) {
  return (
    <div style={styles.buttons}>
      <ButtonToolbar>
        <ToggleButtonGroup
          type="radio"
          name="options"
          defaultValue="staff"
          value={props.mode}
          onChange={props.modeChange}
        >
          <ToggleButton bsStyle={props.mode === 'staff' ? 'primary' : 'default'} value="staff">
            근무 생성
          </ToggleButton>
          <ToggleButton bsStyle={props.mode === 'work' ? 'primary' : 'default'} value="work">
            근무 조회
          </ToggleButton>
        </ToggleButtonGroup>
      </ButtonToolbar>
      {
        props.mode === 'staff' ?
          <h3>근무를 추가할 직원을 선택하십시요.</h3> : null
      }
    </div>
  );
};

export default WorkOrStaff;
