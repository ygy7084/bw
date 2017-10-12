import express from 'express';
import socket from '../server';
import Datetime from '../modules/datetime';
import {
  History,
} from '../models';

const router = express.Router();

// 이력 생성
router.post('/', (req, res) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body.data, 'customerName') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'staffSn') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'staffName') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'barcode_id') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'bus') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'state')
  ) {
    return res.status(500).json({ message: '이력 생성 오류: 올바른 값이 입력되지 않았습니다.' });
  }
  const data = {
    customerName: req.body.data.customerName,
    customerPhone: req.body.data.customerPhone,
    staffSn: req.body.data.staffSn,
    staffName: req.body.data.staffName,
    barcode_id: req.body.data.barcode_id,
    bus: req.body.data.bus,
    state: req.body.data.state,
    enteringBus: req.body.data.enteringBus || -1,
    outgoingBus: req.body.data.outgoingBus || -1,
    alert: req.body.data.alert || false,
    datetime: new Datetime(new Date()).dateObject,
  };
  const history = new History(data);
  history.save((err, result) => {
    if (err) {
      return res.status(500).json({ message: '이력 생성 오류: 오류가 있습니다.' });
    }
    socket.emit('historyCreate', result);
    return res.json({
      data: result,
    });
  });
  return null;
});

// 이력 반환
router.get('/:_id', (req, res) => {
  History.findOne({ _id: req.params._id })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '이력 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});

// 이력 리스트 반환
router.get('/', (req, res) => {
  History.find({})
    .sort({ datetime: -1 })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '이력 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});

// 이력 삭제
router.delete('/', (req, res) => {
  History.remove(
    {},
    (err, result) => {
      socket.emit('historyDelete', '');
      return res.json({
        data: result,
      });
    },
  );
  return null;
});

export default router;
