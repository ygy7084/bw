import React from 'react';
import Radium from 'radium';
import {
  Table,
  Panel,
  PanelGroup,
  Tooltip,
  OverlayTrigger,
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton,
  Label,
} from 'react-bootstrap';

const styles = {
  table: {
    margin: 'auto',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  panelHeader: {
    base: {
      display: 'inline',
      ':hover': {
        cursor: 'pointer',
      },
    },
    statusOK: {
      color: 'blue',
    },
    statusBad: {
      color: 'red',
    },
  },
  table_th: {
    base: {
      textAlign: 'center',
    },
    number: {
      width: '10%',
    },
    name: {
      width: '20%',
    },
    phone: {
      width: '30%',
    },
    bus: {
      width: '20%',
    },
    state: {
      width: '20%',
    },
  },
  tabel_tr_td: {
    padding: '1rem',
  },
};
class BusRealtimeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioBtn: '입경탑승',
    };
  }
  render() {
    const { buses, customers } = this.props;
    const busData = {};
    let allEnteredCustomer = 0;
    for (const bus of buses) {
      busData[`bus${bus.number}`] = {
        number: bus.number,
        datetime: bus.datetime,
        customers: [],
        enteredCustomer: 0,
        missEnteredCustomers: [],
      };
    }
    for (const customer of customers) {
      const bus = this.state.radioBtn === '입경탑승' ? customer.enteringBus : customer.outgoingBus;
      if (customer.bus && busData[`bus${customer.bus}`]) {
        busData[`bus${customer.bus}`].customers.push(customer);
        if (
          customer.state === this.state.radioBtn &&
          bus &&
          busData[`bus${bus}`]
        ) {
          busData[`bus${bus}`].enteredCustomer += 1;
          allEnteredCustomer += 1;
          if (customer.bus !== bus && busData[`bus${bus}`]) {
            busData[`bus${bus}`].missEnteredCustomers.push(customer);
          }
        }
      } else if (customer.state === this.state.radioBtn && bus && busData[`bus${bus}`]) {
        busData[`bus${bus}`].enteredCustomer += 1;
        allEnteredCustomer += 1;
        busData[`bus${bus}`].missEnteredCustomers.push(customer);
      }
    }
    const busDataArray = [];
    for (const a in busData) {
      busDataArray.push(busData[a]);
    }
    return (
      <div>
        <div>
          <Label bsStyle={this.props.realtime ? 'success' : 'danger'}>
            {this.props.realtime ? '실시간 반영 중' : '실시간 연동 실패, 새로고침 필요'}
          </Label>
        </div>
        <div>
          <ButtonToolbar>
            <ToggleButtonGroup
              type="radio"
              name="options"
              defaultValue={this.state.radioBtn}
              onChange={value => this.setState({ radioBtn: value })}
            >
              <ToggleButton
                bsStyle={this.state.radioBtn === '입경탑승' ? 'primary' : 'default'}
                value="입경탑승"
              >입경탑승</ToggleButton>
              <ToggleButton
                bsStyle={this.state.radioBtn === '출경탑승' ? 'primary' : 'default'}
                value="출경탑승"
              >출경탑승</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </div>
        <div>
          <h4>{`${allEnteredCustomer} / ${customers.filter(obj => obj.bus !== -1).length}`}</h4>
          {
            <PanelGroup>
              {
                busDataArray.map((bus) => {
                  const time = bus.datetime.toLocaleTimeString();
                  const header = (
                    <div>
                      <p key={bus.number} style={styles.panelHeader.base}>{`${bus.number}번 버스   `}</p>
                      {this.state.radioBtn === '출경탑승' ? <p key={`${bus.number}${time}time`} style={styles.panelHeader.base}>{`${time}   `}</p> : null}
                      <p key={`${bus.number}${time}`} style={[styles.panelHeader.base, styles.panelHeader.statusOK]}>{`${bus.enteredCustomer}/${bus.customers.length}   `}</p>
                      {bus.missEnteredCustomers.length ?
                        <p
                          key={`${bus.number}${time}miss`}
                          style={[styles.panelHeader.base, styles.panelHeader.statusBad]}
                        >잘못된 탑승자 있음
                        </p>
                        :
                        null
                      }
                    </div>
                  );
                  return (
                    <Panel
                      key={`${bus.number}panel`}
                      collapsible
                      header={header}
                      eventKey={bus.number}
                    >
                      <Table
                        style={styles.table}
                        striped
                        bordered
                        hover
                      >
                        <thead>
                          <tr>
                            <th style={[styles.table_th.base, styles.table_th.number]}>번호</th>
                            <th style={[styles.table_th.base, styles.table_th.name]}>이름</th>
                            <th style={[styles.table_th.base, styles.table_th.bus]}>지정버스</th>
                            <th style={[styles.table_th.base, styles.table_th.bus]}>탑승버스</th>
                            <th style={[styles.table_th.base, styles.table_th.state]}>상태</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            bus.customers.map((customer, i) =>
                              (
                                <tr
                                  key={customer._id}
                                  style={styles.table_tr}
                                >
                                  <td>{i + 1}</td>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id="tooltip">
                                        <strong>{customer.phone}</strong>
                                      </Tooltip>
                                    }
                                  >
                                    <td>{customer.name}</td>
                                  </OverlayTrigger>
                                  <td>{customer.bus === -1 ? '' : customer.bus}</td>
                                  <td>
                                    {
                                      this.state.radioBtn === '입경탑승' ?
                                        customer.enteringBus === -1 ? '' : customer.enteringBus
                                        :
                                        customer.outgoingBus === -1 ? '' : customer.outgoingBus
                                    }
                                  </td>
                                  <td>{customer.state}</td>
                                </tr>
                              ))
                          }
                          {
                            bus.missEnteredCustomers.map((customer, i) =>
                              (
                                <tr
                                  key={customer._id}
                                  style={styles.table_tr}
                                >
                                  <td style={{ background: 'red' }}>{bus.customers.length + i + 1}</td>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id="tooltip">
                                        <strong>{customer.phone}</strong>
                                      </Tooltip>
                                    }
                                  >
                                    <td>{customer.name}</td>
                                  </OverlayTrigger>
                                  <td>{customer.bus === -1 ? '' : customer.bus}</td>
                                  <td>
                                    {
                                      this.state.radioBtn === '입경탑승' ?
                                        customer.enteringBus === -1 ? '' : customer.enteringBus
                                        :
                                        customer.outgoingBus === -1 ? '' : customer.outgoingBus
                                    }
                                  </td>
                                  <td>{customer.state}</td>
                                </tr>
                              ))
                          }
                        </tbody>
                      </Table>
                    </Panel>
                  )}
                )
              }
            </PanelGroup>
          }
        </div>
      </div>
    );
  }
}

export default Radium(BusRealtimeList);
