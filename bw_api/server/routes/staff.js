import express from 'express';
import {
  Staff,
} from '../models';

const router = express.Router();

// 직원 생성
router.post('/', (req, res) => {
  const staffTemp = {
    name: req.body.data.name,
    level: req.body.data.level,
    location: req.body.data.location,
    barcode_id: req.body.data.barcode_id,
    sn: req.body.data.sn || Math.floor(Math.random() * 10000),
  };
  let staff = new Staff(staffTemp);
  let recursion = 0;
  (function snCreater() {
    staff.save((err, result) => {
      if (err) {
        if (!recursion && req.body.data.sn) {
          return res.status(500).json({ message: '직원 생성 오류: 중복된 사번이 존재하거나 오류가 있습니다.' });
        }
        staffTemp.sn = Math.floor(Math.random() * 10000);
        staff = new Staff(staffTemp);
        recursion += 1;
        if (recursion < 10) {
          return snCreater();
        }
        return res.status(500).json({ message: '직원 생성 오류: 다시 입력해주십시요. 또한 입력된 사번이 너무 많습니다. 시스템 관리자에게 문의하세요.' });
      }
      if (!result.barcode_id || result.barcode_id === '') {
        Staff.findOneAndUpdate(
          { _id: result._id },
          {
            $set: { barcode_id: String(result._id) },
          },
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: '직원 생성 오류: 바코드 생성 과정에 오류가 있습니다.' });
            }
            return res.json({
              data: result,
            });
          },
        );
      } else {
        return res.json({
          data: result,
        });
      }
    });
  }());
  return null;
});
// 직원 반환
router.get('/barcode/:_id', (req, res) => {
  Staff.findOne({ barcode_id: req.params._id })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '직원 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 직원 리스트 반환
router.get('/', (req, res) => {
  Staff.find({})
    .sort({ name: 1 })
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '직원 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 직원 수정
router.put('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '직원 수정 오류: _id가 전송되지 않았습니다.' });
  }
  const properties = [
    'sn',
    'name',
    'level',
    'location',
    'barcode_id',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Staff.findOneAndUpdate(
    { _id: req.body.data._id },
    update,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: '직원 수정 오류: 사번이 중복되거나 에러가 발생했습니다.' });
      }
      return res.json({
        data: result,
      });
    },
  );
  return null;
});
// 직원 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '직원 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Staff.findOneAndRemove(
    { _id: req.body.data._id },
    (err, result) =>
      res.json({
        data: result,
      }),
  );
  return null;
});
// 직원 전부 삭제
router.delete('/all', (req, res) => {
  Staff.deleteMany({}, (err) => {
    if (err) {
      return res.status(500).json({ message: '직원 삭제 오류: DB 삭제에 문제가 있습니다.' });
    }
    const staff = new Staff({
      sn: '0000',
      level: '관리자',
      name: '초기관리자',
      barcode_id: '0000',
    });
    staff.save((err, result) => {
      if (err) {
        return res.status(500).json({ message: '직원 삭제 오류: 초기 관리자 계정 생성에 문제가 있습니다. 수동으로 DB를 접속하십시요.' });
      }
      res.json({
        data: result,
      });
    });
  });
});

export default router;
