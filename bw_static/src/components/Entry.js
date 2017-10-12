import React from 'react';
import {
  Button,
  Form,
} from 'react-bootstrap';

const styles = {
  vertical_center: {
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
  },
  horizontal_center: {
    margin: '0 auto',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    fontSize: '2rem',
  },
  input: {
    textAlign: 'center',
    fontSize: '5rem',
    height: '5rem',
    maxWidth: '400px',
    width: '100%',
  },
  button: {
    background: 'rgb(38, 50, 56)',
    color: 'white',
    fontSize: '2rem',
  },
};
class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guide: '접속 코드를 입력하십시요.',
      codeInput: '',
    };
    this.handleCodeInputChange = this.handleCodeInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.success === 'FAILURE') {
      this.setState({ guide: '접속 코드가 올바르지 않습니다.'});
    } else if (nextProps.success === 'WAITING') {
      this.setState({ guide: '로그인 중' });
    }
  }
  handleCodeInputChange(e) {
    e.preventDefault();
    this.setState({ codeInput: e.target.value });
  }
  handleLogin(e) {
    e.preventDefault();
    this.props.login(this.state.codeInput);
  }
  render() {
    return (
      <div>
        <div className="container" style={styles.vertical_center}>
          <div style={styles.horizontal_center}>
            <Form>
              <h4>{this.state.guide}</h4>
              <input
                type="text"
                onChange={this.handleCodeInputChange}
                value={this.state.codeInput}
                style={styles.input}
              />
              <Button
                onClick={this.handleLogin}
                style={styles.button}
                type="submit"
                block
              >
                접속
              </Button>
            </Form>
            <hr />
            <p>문의 : 000-0000-0000</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Entry;
