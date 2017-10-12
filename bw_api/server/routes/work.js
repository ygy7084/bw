import express from 'express';
import XLSX from 'xlsx';
import tmp from 'tmp';

import {
  Work,
} from '../models';
import Datetime from '../modules/datetime';

const router = express.Router();
// 엑셀 출력
router.get('/exceldownload', (req, res) => {
  Work.find({})
    .populate('staff')
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '근무 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      const uniqueTime = result.map((obj) => {
        const newObj = new Date(obj.datetime);
        newObj.setHours(0);
        newObj.setMinutes(0);
        return newObj.getTime();
      })
        .filter((v, i, s) => s.indexOf(v) === i)
        .sort((a, b) => a - b);
      const uniqueStaff = result.map((doc) => {
        if (doc.staff) {
          return {
            sn: doc.staff.sn,
            name: doc.staff.name,
            location: doc.staff.location,
            barcode_id: doc.staff.barcode_id,
            sum: 0,
            works: [],
          };
        }
        return null;
      }).filter((v, i, s) => v !== null && s.findIndex(obj => obj.sn === v.sn) === i);
      for (const obj of result) {
        const staff = uniqueStaff.find(staff => staff.sn === obj.staff.sn);
        staff.works.push({
          datetime: obj.datetime.getTime(),
          endDatetime: obj.endDatetime.getTime(),
          workingHours: obj.workingHours,
        });
        staff.sum += Number(obj.workingHours) || 0;
      }
      const ws_data_temp = [];
      for (let ti = 0; ti < uniqueTime.length; ti += 1) {
        const arr = [new Date(uniqueTime[ti]).toLocaleDateString()];
        for (let si = 0; si < uniqueStaff.length; si += 1) {
          const work =
            uniqueStaff[si].works.find(obj => new Date(obj.datetime).toDateString() === new Date(uniqueTime[ti]).toDateString());
          if (work) {
            arr.push(work.workingHours);
            arr.push(new Datetime(new Date(work.datetime)).timeString);
            arr.push(new Datetime(new Date(work.endDatetime)).timeString);
            if (work.workingHours >= 8) {
              arr.push('o');
            } else {
              arr.push('x');
            }
          } else {
            arr.push(0);
            arr.push('');
            arr.push('');
            arr.push('x');
          }
        }
        ws_data_temp.push(arr);
      }
      const wb = XLSX.utils.book_new();
      const ws_name = 'works';
      const sparsedUniqueStaff = [];
      for (let si = 0; si < uniqueStaff.length; si += 1) {
        sparsedUniqueStaff.push(uniqueStaff[si]);
        sparsedUniqueStaff.push({
          sn: '',
          name: '',
          location: '',
          sum: '',
          barcode_id: '',
        });
        sparsedUniqueStaff.push({
          sn: '',
          name: '',
          location: '',
          sum: '',
          barcode_id: '',
        });
        sparsedUniqueStaff.push({
          sn: '',
          name: '',
          location: '',
          sum: '',
          barcode_id: '',
        });
      }
      let extra = ['근무날짜'];
      for (let si = 0; si < uniqueStaff.length; si += 1) {
        extra.push('근무시간');
        extra.push('출근');
        extra.push('퇴근');
        extra.push('전일');
      }
      let ws_data = [
        ['바코드'].concat(sparsedUniqueStaff.map(staff => staff.barcode_id)),
        ['사번'].concat(sparsedUniqueStaff.map(staff => staff.sn)),
        ['이름'].concat(sparsedUniqueStaff.map(staff => staff.name)),
        ['근무지'].concat(sparsedUniqueStaff.map(staff => staff.location)),
        extra,
      ];
      ws_data = ws_data.concat(ws_data_temp);
      ws_data.push(['근무합계'].concat(sparsedUniqueStaff.map(staff => staff.sum)));

      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      tmp.file((error, path) => {
        if (error) {
          return res.status(500).json({ message: '엑셀 생성 오류: 오류가 있습니다.', error });
        }
        XLSX.writeFile(wb, path);
        return res.download(path, 'works.xlsx');
      });
    });
});
// 근무 생성
router.post('/', (req, res) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body.data, 'staff') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeYear') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeMonth') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeDate') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeHour') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeMinute') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeYear') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeMonth') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeDate') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeHour') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeMinute') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'workingHours')
  ) {
    return res.status(500).json({ message: '근무 생성 오류: 올바른 값이 입력되지 않았습니다.' });
  }
  const datetime = new Datetime(new Date());
  datetime.year = parseInt(req.body.data.datetimeYear, 10);
  datetime.month = parseInt(req.body.data.datetimeMonth, 10);
  datetime.date = parseInt(req.body.data.datetimeDate, 10);
  datetime.hour = parseInt(req.body.data.datetimeHour, 10);
  datetime.minute = parseInt(req.body.data.datetimeMinute, 10);
  datetime.second = 0;
  const endDatetime = new Datetime(new Date());
  endDatetime.year = parseInt(req.body.data.endDatetimeYear, 10);
  endDatetime.month = parseInt(req.body.data.endDatetimeMonth, 10);
  endDatetime.date = parseInt(req.body.data.endDatetimeDate, 10);
  endDatetime.hour = parseInt(req.body.data.endDatetimeHour, 10);
  endDatetime.minute = parseInt(req.body.data.endDatetimeMinute, 10);
  endDatetime.second = 0;
  const date = datetime.dateObject;
  date.setHours(0);
  date.setMinutes(0);
  const work = new Work({
    staff: req.body.data.staff,
    dateID: date.getTime(),
    datetime: datetime.dateObject,
    endDatetime: endDatetime.dateObject,
    workingHours: Math.round(req.body.data.workingHours * 100) / 100,
  });
  work.save((err, result) => {
    if (err) {
      return res.status(500).json({ message: '근무 생성 오류: 중복된 근무가 있습니다.' });
    }
    return res.json({
      data: result,
    });
  });
  return null;
});
// 근무 리스트 반환
router.get('/', (req, res) => {
  Work.find({})
    .sort({ _id: -1 })
    .populate('staff')
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '근무 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 근무 수정
router.put('/', (req, res) => {
  if (
    !req.body.data._id ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeYear') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeMonth') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeDate') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeHour') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'datetimeMinute') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeYear') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeMonth') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeDate') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeHour') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'endDatetimeMinute') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'workingHours')
  ) {
    return res.status(500).json({ message: '근무 수정 오류: 올바른 값이 입력되지 않았습니다.' });
  }

  const datetime = new Datetime(new Date());
  datetime.year = parseInt(req.body.data.datetimeYear, 10);
  datetime.month = parseInt(req.body.data.datetimeMonth, 10);
  datetime.date = parseInt(req.body.data.datetimeDate, 10);
  datetime.hour = parseInt(req.body.data.datetimeHour, 10);
  datetime.minute = parseInt(req.body.data.datetimeMinute, 10);
  datetime.second = 0;
  const endDatetime = new Datetime(new Date());
  endDatetime.year = parseInt(req.body.data.endDatetimeYear, 10);
  endDatetime.month = parseInt(req.body.data.endDatetimeMonth, 10);
  endDatetime.date = parseInt(req.body.data.endDatetimeDate, 10);
  endDatetime.hour = parseInt(req.body.data.endDatetimeHour, 10);
  endDatetime.minute = parseInt(req.body.data.endDatetimeMinute, 10);
  endDatetime.second = 0;
  const date = datetime.dateObject;
  date.setHours(0);
  date.setMinutes(0);
  const data = {
    datetime: datetime.dateObject,
    endDatetime: endDatetime.dateObject,
    dateID: date.getTime(),
    workingHours: Math.round(req.body.data.workingHours * 100) / 100,
  };
  const properties = [
    'datetime',
    'endDatetime',
    'dateID',
    'workingHours',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(data, property)) {
      update.$set[property] = data[property];
    }
  }
  Work.findOneAndUpdate(
    { _id: req.body.data._id },
    update,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: '근무 수정 오류: 중복된 근무가 있거나 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    },
  );
  return null;
});
// 근무 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '근무 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Work.findOneAndRemove(
    { _id: req.body.data._id },
    (err, result) => {
      return res.json({
        data: result,
      });
    },
  );
  return null;
});
router.delete('/all', (req, res) => {
  Work.deleteMany({}, (err, result) => {
    if (err) {
      return res.status(500).json({message: '근무 삭제 오류: DB 삭제에 문제가 있습니다.'});
    }
    return res.json({
      data: result,
    });
  });
  return null;
});
export default router;
