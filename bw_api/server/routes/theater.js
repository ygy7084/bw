import express from 'express';
import {
  Theater,
} from '../models';

const router = express.Router();

// 영화관 생성
router.post('/', (req, res) => {
  const theaterTemp = {
    code: req.body.data.code,
    name: req.body.data.name,
  };
  const theater = new Theater(theaterTemp);
  theater.save((err, result) => {
    if (err) {
      return res.status(500).json({ message: '영화관 생성 오류: 중복된 코드가 존재하거나 오류가 있습니다.' });
    }
    return res.json({
      data: result,
    });
  });
  return null;
});
// 영화관 반환
router.get('/:_id', (req, res) => {
  Theater.findOne({ _id: req.params._id })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '영화관 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 영화관 리스트 반환
router.get('/', (req, res) => {
  Theater.find({})
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '영화관 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 영화관 수정
router.put('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '영화관 수정 오류: _id가 전송되지 않았습니다.' });
  }
  const properties = [
    'code',
    'name',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Theater.findOneAndUpdate(
    { _id: req.body.data._id },
    update,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: '영화관 수정 오류: 사번이 중복되거나 에러가 발생했습니다.' });
      }
      return res.json({
        data: result,
      });
    },
  );
  return null;
});
// 영화관 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '영화관 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Theater.findOneAndRemove(
    { _id: req.body.data._id },
    (err, result) =>
      res.json({
        data: result,
      }),
  );
  return null;
});
// 영화관 전부 삭제
router.delete('/all', (req, res) => {
  Theater.deleteMany({}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: '영화관 삭제 오류: DB 삭제에 문제가 있습니다.' });
    }
    res.json({
      data: result,
    });
  });
});

export default router;
