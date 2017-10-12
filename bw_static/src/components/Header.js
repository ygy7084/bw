import Radium from 'radium';
import React from 'react';
import IconStaff from 'react-icons/lib/ti/user';
import IconWork from 'react-icons/lib/md/access-time';
import IconCustomer from 'react-icons/lib/ti/document-text';
import IconMenu from 'react-icons/lib/ti/th-menu';
import IconBus from 'react-icons/lib/md/directions-bus';
import IconMovie from 'react-icons/lib/md/local-movies';
import IconBarcode from 'react-icons/lib/fa/barcode';
import IconRealtime from 'react-icons/lib/ti/device-desktop';
import IconHistory from 'react-icons/lib/md/history';
import IconTheater from 'react-icons/lib/ti/device-laptop';

import {
  Route,
} from 'react-router-dom';

const style = {
  topBar: {
    position: 'fixed',
    width: '100%',
    height: '55px',
    zIndex: '1000',
    display: 'block',
    background: 'white',
    fontSize: '3rem',
    borderBottom: '1px solid #cfd8dc',
  },
  topBarMenu: {
    position: 'absolute',
    marginTop: '10px',
    marginLeft: '15px',
  },
  topBarMenuWrapper: {
    ':hover': {
      cursor: 'pointer',
    },
  },
  topBarContent: {
    display: 'block',
    textAlign: 'center',
  },
  topBarContent_h3: {
    marginTop: '15px',
  },
  sideBar: {
    base: {
      position: 'fixed',
      width: '200px',
      height: '100%',
      top: '55px',
      zIndex: '1000',
      display: 'block',
      color: 'white',
      background: '#263238',
      overflowY: 'auto',
      paddingBottom: '200px',
    },
    close: {
      left: '-200px',
    },
  },
  sideList: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  sideListItem_li: {
    base: {
      ':hover': {
        background: '#20a8d8',
        cursor: 'pointer',
      },
      ':focus': {
        outline: '0',
      },
    },
    selected: {
      background: '#405057',
    },
  },
  sideListItem: {
    display: 'block',
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    textDecoration: 'none',
    color: 'white',
    ':focus': {
      outline: '0',
    },
    fontSize: '1.5rem',
  },
  sideListItemIcon: {
    fontSize: '26px',
    marginRight: '16px',
  },
  loginStatus: {
    textAlign: 'center',
    marginTop: '30px',
  },
  logout: {
    ':hover': {
      cursor: 'pointer',
    },
  },
};
const sideListItems = [
  { name: '직원',
    menu: 'staff',
    path: '/staff',
    icon: IconStaff,
    authority: ['관리자'] },
  { name: '직원 근무 관리',
    menu: 'work',
    path: '/work',
    icon: IconWork,
    authority: ['관리자'] },
  { name: '고객',
    menu: 'customer',
    path: '/customer',
    icon: IconCustomer,
    authority: ['관리자'] },
  { name: '고객 실시간',
    menu: 'realtime',
    path: '/realtime',
    icon: IconRealtime,
    authority: ['관리자', '직원'] },
  { name: '고객 이력 실시간',
    menu: 'history',
    path: '/history',
    icon: IconHistory,
    authority: ['관리자', '직원'] },
  { name: '버스',
    menu: 'bus',
    path: '/bus',
    icon: IconBus,
    authority: ['관리자'] },
  { name: '버스 실시간',
    menu: 'busrealtime',
    path: '/busrealtime',
    icon: IconRealtime,
    authority: ['관리자', '직원'] },
  { name: '영화',
    menu: 'movie',
    path: '/movie',
    icon: IconMovie,
    authority: ['관리자'] },
  { name: '영화관',
    menu: 'theater',
    path: '/theater',
    icon: IconTheater,
    authority: ['관리자'] },
  { name: '예매 현황 실시간',
    menu: 'reservation',
    path: '/reservation',
    icon: IconRealtime,
    authority: ['관리자', '직원'] },
  { name: '바코드 리더(이동)',
    menu: 'barcode',
    path: '/barcode',
    icon: IconBarcode,
    authority: ['관리자', '직원'] },
  { name: '바코드 리더(영화)',
    menu: 'barcodemovie',
    path: '/barcodemovie',
    icon: IconBarcode,
    authority: ['관리자', '직원'] },
  { name: '바코드 리더(근무)',
    menu: 'barcodestaff',
    path: '/barcodestaff',
    icon: IconBarcode,
    authority: ['관리자'] },
];
const Header = function Header(props) {
  const sideBarStyle = [style.sideBar.base];
  if (props.menuClose) {
    sideBarStyle.push(style.sideBar.close);
  }
  const menuClick = props.menuClick;
  const loginStatus = {
    name: '',
    sn: '',
    level: '',
  };
  if (props.staff) {
    loginStatus.name = props.staff.name;
    loginStatus.sn = props.staff.sn;
    loginStatus.level = props.staff.level;
  }
  return (
    <div>
      <div style={style.topBar}>
        <div style={style.topBarMenuWrapper}>
          <IconMenu
            style={style.topBarMenu}
            onClick={props.toggleMenu}
          />
        </div>
        <div style={style.topBarContent}>
          <h3 style={style.topBarContent_h3}>DMZ 영화제</h3>
        </div>
      </div>
      <nav style={sideBarStyle}>
        <ul style={style.sideList}>
          {sideListItems.map((item) => {
            if (item.authority.find(obj => obj === loginStatus.level)) {
              return (
                <Route
                  key={item.name}
                  path={item.path}
                  children={props => (
                    <li
                      key={item.name + item.menu}
                      style={props.match ?
                        [style.sideListItem_li.base, style.sideListItem_li.selected]
                        : style.sideListItem_li.base}
                    >
                      <a
                        key={item.menu}
                        style={style.sideListItem}
                        onClick={() => { menuClick(item.menu); }}
                        role="button"
                        tabIndex={0}
                      >
                        <item.icon style={style.sideListItemIcon} />
                        {item.name}
                      </a>
                    </li>
                  )}
                />
              );
            }
            return null;
          })}
        </ul>
        <div style={style.loginStatus}>
          <h4>접속 정보</h4>
          <p>{`이름 : ${loginStatus.name}`}</p>
          <p>{`사번 : ${loginStatus.sn}`}</p>
          <p>{`권한 : ${loginStatus.level}`}</p>
          <a
            key="logout"
            style={style.logout}
            onClick={props.logout}
            role="button"
            tabIndex={0}
          ><b>로그아웃</b></a>
        </div>
      </nav>
    </div>
  );
};

export default Radium(Header);

