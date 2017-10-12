import express from 'express';
import {
  Bus,
} from '../models';
import Datetime from '../modules/datetime';

const router = express.Router();

// 버스 생성
router.post('/', (req, res) => {
  if (
    !req.body.data.number ||
    !req.body.data.year ||
    !req.body.data.month ||
    !req.body.data.date ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'hour') ||// 0이 올 수도 있으므로 프로퍼티를 검사한다.
    !Object.prototype.hasOwnProperty.call(req.body.data, 'minute')
  ) {
    return res.status(500).json({ message: '버스 생성 오류: 올바른 값이 입력되지 않았습니다.' });
  }
  const datetime = new Datetime(new Date());
  datetime.year = parseInt(req.body.data.year, 10);
  datetime.month = parseInt(req.body.data.month, 10);
  datetime.date = parseInt(req.body.data.date, 10);
  datetime.hour = parseInt(req.body.data.hour, 10);
  datetime.minute = parseInt(req.body.data.minute, 10);
  datetime.second = 0;

  const bus = new Bus({
    number: req.body.data.number,
    datetime: datetime.dateObject,
  });
  bus.save((err, result) => {
    if (err) {
      return res.status(500).json({ message: '버스 생성 오류: 중복된 번호가 존재하거나 오류가 있습니다.' });
    } else {
      return res.json({
        data: result,
      });
    }
  });
  return null;
});
// 버스 반환
router.get('/:_id', (req, res) => {
  Bus.findOne({ _id: req.params._id })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '버스 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 버스 리스트 반환
router.get('/', (req, res) => {
  Bus.find({})
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '버스 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 버스 수정
router.put('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '버스 수정 오류: _id가 전송되지 않았습니다.' });
  } else if (
    !req.body.data.year ||
    !req.body.data.month ||
    !req.body.data.date ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'hour') ||// 0이 올 수도 있으므로 프로퍼티를 검사한다.
    !Object.prototype.hasOwnProperty.call(req.body.data, 'minute')
  ) {
    return res.status(500).json({ message: '버스 수정 오류: 시각 데이터가 전송되지 않았습니다.' });
  }
  const datetime = new Datetime(new Date());
  datetime.year = parseInt(req.body.data.year, 10);
  datetime.month = parseInt(req.body.data.month, 10);
  datetime.date = parseInt(req.body.data.date, 10);
  datetime.hour = parseInt(req.body.data.hour, 10);
  datetime.minute = parseInt(req.body.data.minute, 10);
  datetime.second = 0;

  const data = {
    number: req.body.data.number,
    datetime: datetime.dateObject,
  };
  const properties = [
    'number',
    'datetime',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(data, property)) {
      update.$set[property] = data[property];
    }
  }
  Bus.findOneAndUpdate(
    { _id: req.body.data._id },
    update,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: '버스 수정 오류: 버스 번호가 중복되거나 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    },
  );
  return null;
});
// 버스 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '버스 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Bus.findOneAndRemove(
    { _id: req.body.data._id },
    (err, result) => {
      return res.json({
        data: result,
      });
    },
  );
  return null;
});
// 버스 삭제
router.delete('/all', (req, res) => {
  Bus.deleteMany({}, (err, result) => {
    if (err) {
      return res.status(500).json({message: '버스 삭제 오류: DB 삭제에 문제가 있습니다.'});
    }
    return res.json({
      data: result,
    });
  });
  return null;
});


export default router;
