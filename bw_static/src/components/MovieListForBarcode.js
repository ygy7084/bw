import React from 'react';
import Radium, { StyleRoot } from 'radium';
import {
  Table,
  Pagination,
  FormControl,
  DropdownButton,
  MenuItem,
  Button,
  InputGroup,
  ButtonGroup,
} from 'react-bootstrap';

const InputGroupRadium = Radium(InputGroup);

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
    number: {
      width: '10%',
    },
    datetime: {
      width: '25%',
    },
    theater: {
      width: '10%',
    },
  },
  tabel_tr_td: {
    padding: '1rem',
  },
  table_tr: {
    ':hover': {
      cursor: 'pointer',
    },
  },
  findForm: {
    width: '150px',
  },
  pagination: {
    textAlign: 'center',
  },
  leftButtons: {
    display: 'inline-flex',
  },
  rightButtons: {
    width: '300px',
    float: 'right',
    '@media screen and (max-width: 700px)': {
      width: '100%',
    },
  },
};
class MovieListForBarcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemInList: 10,
      findMode: '제목',
      findInput: '',
      list: this.props.list,
      selectedTheater: '영화관 선택',
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectTheater = this.handleSelectTheater.bind(this);
    this.handleFind = this.handleFind.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.list && JSON.stringify(this.props.list) !== JSON.stringify(nextProps.list)) {
      this.setState({
        list: nextProps.list,
        findInput: '',
        findMode: '제목',
        selectedTheater: '영화관 선택',
        activePage:
          Math.ceil(nextProps.list.length / this.state.itemInList) < this.state.activePage && this.state.activePage > 1 ?
            this.state.activePage - 1 : this.state.activePage,
      });
    }
  }
  handleSelect(value) {
    this.setState({ activePage: value });
  }
  handleSelectTheater(value) {

  }
  handleFind(e) {
    let input = e.target.value;
    if (input === '') {
      this.setState({
        findInput: '',
        list: this.props.list,
        activePage: 1,
      });
    } else {
      try {
        const regex = new RegExp(input);
        const found = [];
        let property;
        switch (this.state.findMode) {
          case '제목':
            property = 'name';
            break;
          case '상영시각':
            property = 'datetimeString';
            break;
          default:
            break;
        }
        for (const obj of this.props.list) {
          if (obj && regex.exec(String(obj[property]))) {
            found.push(obj);
          }
        }
        this.setState({
          list: found,
          findInput: input,
          activePage: 1,
        });
      } catch (e) {
        console.log('정규식 문자는 사용할 수 없습니다.');
        console.log(e);
      }
    }
  }
  render() {
    const showList = this.state.list.slice(
      (this.state.activePage - 1) * this.state.itemInList,
      this.state.activePage * this.state.itemInList);
    return (
      <StyleRoot>
        <div>
          <h2>매표를 진행할 영화를 선택해주세요</h2>
          <div style={styles.leftButtons}>
            <ButtonGroup>
              <DropdownButton
                id="dropDownMovie1"
                title={`${this.state.itemInList}개씩 보기`}
                onSelect={value => this.setState({ itemInList: value, activePage: 1 })}
              >
                <MenuItem active={this.state.itemInList === 10} eventKey={10}>10개씩 보기</MenuItem>
                <MenuItem active={this.state.itemInList === 20} eventKey={20}>20개씩 보기</MenuItem>
                <MenuItem active={this.state.itemInList === 50} eventKey={50}>50개씩 보기</MenuItem>
              </DropdownButton>
              <Button
                bsStyle="primary"
                onClick={this.props.refresh}
              >새로 고침</Button>
            </ButtonGroup>
          </div>
          <InputGroupRadium style={styles.rightButtons}>
            <DropdownButton
              id="dropDownMovie2"
              componentClass={InputGroup.Button}
              onSelect={value => this.setState({
                selectedTheater: value,
                list: value !== '영화관 선택' ? this.props.list.filter(obj => obj.theater === value) : this.props.list,
                activePage: 1,
              })}
              title={this.state.selectedTheater}
            >
              <MenuItem active={this.state.selectedTheater === '영화관 선택'} eventKey="영화관 선택">영화관 선택</MenuItem>
              {
                this.props.uniqueTheater.map(obj =>
                  <MenuItem key={obj} active={this.state.selectedTheater === obj} eventKey={obj}>{obj}</MenuItem>
                )
              }
            </DropdownButton>
            <DropdownButton
              id="dropDownMovie2"
              componentClass={InputGroup.Button}
              onSelect={value => this.setState({
                findMode: value,
                findInput: '',
                list: this.props.list,
                activePage: 1,
                selectedTheater: '영화관 선택',
              })}
              title={this.state.findMode}
            >
              <MenuItem active={this.state.findMode === '제목'} eventKey="제목">제목</MenuItem>
              <MenuItem active={this.state.findMode === '상영시각'} eventKey="상영시각">상영시각</MenuItem>
            </DropdownButton>
            <FormControl
              type="text"
              value={this.state.findInput}
              onChange={this.handleFind}
            />
          </InputGroupRadium>
          <Table
            style={styles.table}
            striped
            bordered
            hover
          >
            <thead>
              <tr>
                <th style={[styles.table_th.base, styles.table_th.number]}>번호</th>
                <th style={[styles.table_th.base, styles.table_th.name]}>제목</th>
                <th style={[styles.table_th.base, styles.table_th.theater]}>영화관</th>
                <th style={[styles.table_th.base]}>총 좌석</th>
                <th style={[styles.table_th.base, styles.table_th.datetime]}>상영시각</th>
              </tr>
            </thead>
            <tbody>
              {
                showList.map((item, i) =>
                  (
                    <tr
                      key={item._id}
                      onClick={() =>
                        this.props.movieClick(item)
                      }
                      style={styles.table_tr}
                    >
                      <td>{((this.state.activePage - 1) * this.state.itemInList) + i + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.theater}</td>
                      <td>{item.available}</td>
                      <td>{item.datetimeString}</td>
                    </tr>
                  ))
              }
            </tbody>
          </Table>
          <div style={styles.pagination}>
            <Pagination
              bsSize="medium"
              items={Math.ceil(this.state.list.length / this.state.itemInList)}
              maxButtons={10}
              activePage={this.state.activePage}
              onSelect={this.handleSelect}
              prev
              next
              first
              last
            />
          </div>
        </div>
      </StyleRoot>
    );
  }
}

export default Radium(MovieListForBarcode);
