import React from 'react';
import Radium, { StyleRoot } from 'radium';
import {
  Table,
  Pagination,
  FormControl,
  DropdownButton,
  MenuItem,
  InputGroup,
  ButtonGroup,
  Button,
  Label,
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
    name: {
      width: '30%',
    },
    staffSn: {
      width: '10%',
    },
    datetime: {
      width: '30%',
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
    width: '200px',
    float: 'right',
    '@media screen and (max-width: 700px)': {
      width: '100%',
    },
  },
};

class ReservationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemInList: 10,
      findMode: '제목',
      findInput: '',
      list: this.props.list,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleFindInput = this.handleFindInput.bind(this);
    this.handleFind = this.handleFind.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.list) !== JSON.stringify(nextProps.list)) {
      if (this.state.findInput !== '') {
        this.handleFind(this.state.findInput, nextProps.list);
      } else {
        this.setState({
          list: nextProps.list,
        });
      }
    }
  }
  handleSelect(value) {
    this.setState({ activePage: value });
  }
  handleFindInput(e) {
    this.handleFind(e.target.value, this.props.list);
  }
  handleFind(input) {
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
        let doc;
        switch (this.state.findMode) {
          case '제목':
            doc = 'movie';
            property = 'name';
            break;
          case '상영시각':
            doc = 'movie';
            property = 'datetimeString';
            break;
          case '고객':
            doc = 'customer';
            property = 'name';
            break;
          case '직원사번':
            doc = 'staff';
            property = 'sn';
            break;
          default:
        }
        for (const obj of this.props.list) {
          if (obj && obj[doc] && regex.exec(String((obj[doc])[property]))) {
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
          <div>
            <Label bsStyle={this.props.realtime ? 'success' : 'danger'}>
              {this.props.realtime ? '실시간 반영 중' : '실시간 연동 실패, 새로고침 필요'}
            </Label>
          </div>
          <div style={styles.leftButtons}>
            <ButtonGroup>
              <DropdownButton
                id="dropDownBus1"
                title={`${this.state.itemInList}개씩 보기`}
                onSelect={value => this.setState({ itemInList: value, activePage: 1 }) }
              >
                <MenuItem active={this.state.itemInList === 10} eventKey={10}>10개씩 보기</MenuItem>
                <MenuItem active={this.state.itemInList === 20} eventKey={20}>20개씩 보기</MenuItem>
                <MenuItem active={this.state.itemInList === 50} eventKey={50}>50개씩 보기</MenuItem>
              </DropdownButton>
              <Button
                bsStyle="danger"
                onClick={this.props.reservationRemoveAllClick}
              >전부 삭제</Button>
            </ButtonGroup>
          </div>
          <InputGroupRadium style={styles.rightButtons}>
            <DropdownButton
              id="dropDownBus2"
              componentClass={InputGroup.Button}
              onSelect={value => this.setState({
                findMode: value,
                findInput: '',
                list: this.props.list,
                activePage: 1,
              })}
              title={this.state.findMode}
            >
              <MenuItem active={this.state.findMode === '제목'} eventKey="제목">제목</MenuItem>
              <MenuItem active={this.state.findMode === '상영시각'} eventKey="상영시각">상영시각</MenuItem>
              <MenuItem active={this.state.findMode === '고객'} eventKey="고객">고객</MenuItem>
              <MenuItem active={this.state.findMode === '직원사번'} eventKey="직원사번">직원사번</MenuItem>
            </DropdownButton>
            <FormControl
              type="text"
              value={this.state.findInput}
              onChange={this.handleFindInput}
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
                <th style={[styles.table_th.base, styles.table_th.datetime]}>상영 시각</th>
                <th style={[styles.table_th.base]}>고객</th>
                <th style={[styles.table_th.base, styles.table_th.staffSn]}>직원사번</th>
              </tr>
            </thead>
            <tbody>
              {
                showList.map((item, i) =>
                  <tr
                    key={`${item._id}`}
                    style={styles.table_tr}
                    onClick={() => this.props.reservationClick(item)}
                  >
                    <td>{((this.state.activePage - 1) * this.state.itemInList) + i + 1}</td>
                    <td>{item.movie ? item.movie.name : '삭제됨'}</td>
                    <td>{item.movie ? item.movie.datetimeString : '삭제됨'}</td>
                    <td>{item.customer ? item.customer.name : '삭제됨'}</td>
                    <td>{item.staff ? item.staff.sn : '삭제됨'}</td>
                  </tr>,
                )
              }
            </tbody>
          </Table>
          <div style={styles.pagination}>
            <Pagination
              bsSize="medium"
              items={Math.ceil(this.state.list.length/this.state.itemInList)}
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
export default Radium(ReservationList);
