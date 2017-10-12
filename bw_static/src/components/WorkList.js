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
    sn: {
      width: '15%',
    },
    name: {
      width: '15%',
    },
    workingHours: {
      width: '15%',
    },
    datetime: {
      width: '15%',
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
class WorkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemInList: 10,
      findMode: '사번',
      findInput: '',
      list: this.props.list,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleFind = this.handleFind.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.list) !== JSON.stringify(nextProps.list)) {
      this.setState({
        list: nextProps.list,
        findInput: '',
        findMode: '사번',
        activePage:
          Math.ceil(nextProps.list.length / this.state.itemInList) < this.state.activePage && this.state.activePage > 1 ?
            this.state.activePage - 1 : this.state.activePage,
      });
    }
  }
  handleSelect(value) {
    this.setState({ activePage: value });
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
        let doc;
        switch (this.state.findMode) {
          case '사번':
            doc = 'staff';
            property = 'sn';
            break;
          case '이름':
            doc = 'staff';
            property = 'name';
            break;
          case '근무시간':
            property = 'workingHours';
            break;
          case '출근':
            property = 'datetimeTimeString';
            break;
          case '퇴근':
            property = 'endDatetimeTimeString';
            break;
          case '근무날짜':
            property = 'datetimeString';
            break;
          default:
        }
        for (const obj of this.props.list) {
          if(doc && obj[doc] && regex.exec(String((obj[doc])[property]))) {
            found.push(obj);
          } else if (!doc && regex.exec(String(obj[property]))) {
            if (property === 'workingHours') {
              if (String(obj[property]) === input) {
                found.push(obj);
              }
            } else {
              found.push(obj);
            }
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
          <div style={styles.leftButtons}>
            <ButtonGroup>
              <DropdownButton
                id="dropDownWork1"
                title={`${this.state.itemInList}개씩 보기`}
                onSelect={value => this.setState({ itemInList: value, activePage: 1 }) }
              >
                <MenuItem active={this.state.itemInList === 10} eventKey={10}>10개씩 보기</MenuItem>
                <MenuItem active={this.state.itemInList === 20} eventKey={20}>20개씩 보기</MenuItem>
                <MenuItem active={this.state.itemInList === 50} eventKey={50}>50개씩 보기</MenuItem>
              </DropdownButton>
              <Button
                bsStyle="primary"
                onClick={this.props.refresh}
              >새로 고침</Button>
              <Button
                bsStyle="danger"
                onClick={this.props.workRemoveAllClick}
              >전부 삭제</Button>
              <Button
                bsStyle="link"
                onClick={this.props.excelDownload}
              >엑셀 다운로드</Button>
            </ButtonGroup>
          </div>
          <InputGroupRadium style={styles.rightButtons}>
            <DropdownButton
              id="dropDownWork2"
              componentClass={InputGroup.Button}
              onSelect={value => this.setState({
                findMode: value,
                findInput: '',
                list: this.props.list,
                activePage: 1,
              })}
              title={this.state.findMode}
            >
              <MenuItem active={this.state.findMode === '사번'} eventKey="사번">사번</MenuItem>
              <MenuItem active={this.state.findMode === '이름'} eventKey="이름">이름</MenuItem>
              <MenuItem active={this.state.findMode === '근무시간'} eventKey="근무시간">근무시간</MenuItem>
              <MenuItem active={this.state.findMode === '출근'} eventKey="출근">출근</MenuItem>
              <MenuItem active={this.state.findMode === '퇴근'} eventKey="퇴근">퇴근</MenuItem>
              <MenuItem active={this.state.findMode === '근무날짜'} eventKey="근무날짜">근무날짜</MenuItem>
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
                <th style={[styles.table_th.base, styles.table_th.sn]}>사번</th>
                <th style={[styles.table_th.base, styles.table_th.name]}>이름</th>
                <th style={[styles.table_th.base, styles.table_th.workingHours]}>근무시간</th>
                <th style={[styles.table_th.base, styles.table_th.datetime]}>출근</th>
                <th style={[styles.table_th.base, styles.table_th.datetime]}>퇴근</th>
                <th style={[styles.table_th.base, styles.table_th.datetime]}>근무날짜</th>
              </tr>
            </thead>
            <tbody>
              {
                showList.map((item, i) =>
                  (
                    <tr
                      key={item._id}
                      onClick={() =>
                        this.props.workClick(item)
                      }
                      style={styles.table_tr}
                    >
                      <td>{((this.state.activePage - 1) * this.state.itemInList) + i + 1}</td>
                      <td>{item.staff ? item.staff.sn : '삭제됨'}</td>
                      <td>{item.staff ? item.staff.name : '삭제됨'}</td>
                      <td>{item.workingHours}</td>
                      <td>{item.datetime.toLocaleTimeString()}</td>
                      <td>{item.endDatetime.toLocaleTimeString()}</td>
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

export default Radium(WorkList);
