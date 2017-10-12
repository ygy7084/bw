import express from 'express';
import socket from '../server';
import {
  Reservation,
} from '../models';

const router = express.Router();

// 예매 생성
router.post('/', (req, res) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.body.data, 'movie') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'customer') ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'staff')
  ) {
    return res.status(500).json({ message: '예매 생성 오류: 올바른 값이 입력되지 않았습니다.' });
  }
  const reservation = new Reservation({
    movie: req.body.data.movie._id,
    customer: req.body.data.customer._id,
    staff: req.body.data.staff._id,
  });
  reservation.save((err, result) => {
    if (err) {
      return res.status(500).json({ message: '예매 생성 오류: 해당 영화와 해당 고객의 중복된 예매가 있습니다.' });
    }
    socket.emit('reservationCreate', {
      _id: result._id,
      movie: req.body.data.movie,
      customer: req.body.data.customer,
      staff: req.body.data.staff,
    });
    return res.json({
      data: result,
    });
  });
  return null;
});

// 예매 리스트 반환
router.get('/', (req, res) => {
  Reservation.find({})
    .sort({ _id: -1 })
    .populate('customer')
    .populate('movie')
    .populate('staff')
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '예매 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});

// 예매 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '예매 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Reservation.findOneAndRemove(
    { _id: req.body.data._id },
    (err, result) => {
      socket.emit('reservationDelete', req.body.data);
      return res.json({
        data: result,
      });
    },
  );
  return null;
});

router.delete('/all', (req, res) => {
  Reservation.deleteMany({}, (err, result) => {
    if (err) {
      return res.status(500).json({message: '예매 삭제 오류: DB 삭제에 문제가 있습니다.'});
    }
    return res.json({
      data: result,
    });
  });
  return null;
});

export default router;
