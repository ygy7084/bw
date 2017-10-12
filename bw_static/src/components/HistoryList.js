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
      width: '5%',
    },
    name: {
      width: '10%',
    },
    phone: {
      width: '15%',
    },
    bus: {
      width: '10%',
    },
    enteringBus: {
      width: '10%',
    },
    outgoingBus: {
      width: '10%',
    },
    staffSn: {
      width: '10%',
    },
    state: {
      width: '10%',
    },
    datetime: {
      width: '20%',
    },
  },
  tabel_tr_td: {
    padding: '1rem',
  },
  table_tr: {
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
class HistoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemInList: 10,
      findMode: '고객이름',
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
        switch (this.state.findMode) {
          case '고객이름':
            property = 'customerName';
            break;
          case '고객전화번호':
            property = 'customerPhone';
            break;
          case '직원사번':
            property = 'staffSn';
            break;
          case '직원이름':
            property = 'staffName';
            break;
          case '바코드 ID':
            property = 'barcode_id';
            break;
          case '지정버스':
            property = 'bus';
            break;
          case '입경버스':
            property = 'enteringBus';
            break;
          case '출경버스':
            property = 'outgoingBus';
            break;
          case '상태':
            property = 'state';
            break;
          case '시각':
            property = 'datetimeString';
            break;

          default:
        }
        for (const obj of this.props.list) {
          if (obj && regex.exec(String(obj[property]))) {
            if ((
              property === 'bus' ||
              property === 'state' ||
              property === 'barcode_id')) {
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
                onSelect={value => this.setState({ itemInList: value, activePage: 1 })}
              >
                <MenuItem active={this.state.itemInList === 10} eventKey={10}>10개씩 보기</MenuItem>
                <MenuItem active={this.state.itemInList === 20} eventKey={20}>20개씩 보기</MenuItem>
                <MenuItem active={this.state.itemInList === 50} eventKey={50}>50개씩 보기</MenuItem>
              </DropdownButton>
              <Button
                bsStyle="danger"
                onClick={this.props.historyRemoveAllClick}
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
              <MenuItem active={this.state.findMode === '고객이름'} eventKey="고객이름">고객이름</MenuItem>
              <MenuItem active={this.state.findMode === '고객전화번호'} eventKey="고객전화번호">고객전화번호</MenuItem>
              <MenuItem active={this.state.findMode === '직원사번'} eventKey="직원사번">직원사번</MenuItem>
              <MenuItem active={this.state.findMode === '직원이름'} eventKey="직원이름">직원이름</MenuItem>
              <MenuItem active={this.state.findMode === '바코드 ID'} eventKey="바코드 ID">바코드 ID</MenuItem>
              <MenuItem active={this.state.findMode === '지정버스'} eventKey="지정버스">지정버스</MenuItem>
              <MenuItem active={this.state.findMode === '입경버스'} eventKey="입경버스">입경버스</MenuItem>
              <MenuItem active={this.state.findMode === '출경버스'} eventKey="출경버스">출경버스</MenuItem>
              <MenuItem active={this.state.findMode === '상태'} eventKey="상태">상태</MenuItem>
              <MenuItem active={this.state.findMode === '시각'} eventKey="시각">시각</MenuItem>
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
                <th style={[styles.table_th.base, styles.table_th.name]}>고객이름</th>
                <th style={[styles.table_th.base, styles.table_th.phone]}>고객전화번호</th>
                <th style={[styles.table_th.base, styles.table_th.bus]}>지정버스</th>
                <th style={[styles.table_th.base, styles.table_th.enteringBus]}>입경버스</th>
                <th style={[styles.table_th.base, styles.table_th.outgoingBus]}>출경버스</th>
                <th style={[styles.table_th.base, styles.table_th.staffSn]}>직원사번</th>
                <th style={[styles.table_th.base, styles.table_th.state]}>상태</th>
                <th style={[styles.table_th.base, styles.table_th.datetime]}>시각</th>
              </tr>
            </thead>
            <tbody>
              {
                showList.map((item, i) =>
                  (
                    <tr
                      key={item._id}
                      style={styles.table_tr}
                    >
                      <td>{((this.state.activePage - 1) * this.state.itemInList) + i + 1}</td>
                      <td>{item.customerName}</td>
                      <td>{item.customerPhone}</td>
                      <td>{item.bus === -1 ? '' : item.bus}</td>
                      <td>{item.enteringBus === -1 ? '' : item.enteringBus}</td>
                      <td>{item.outgoingBus === -1 ? '' : item.outgoingBus}</td>
                      <td>{item.staffSn}</td>
                      <td>{item.state}</td>
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

export default Radium(HistoryList);
