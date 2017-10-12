import express from 'express';
import XLSX from 'xlsx';
import multer from 'multer';
import { Types } from 'mongoose';
import socket from '../server';
import {
  Movie,
  Reservation,
} from '../models';
import Datetime from '../modules/datetime';

const router = express.Router();
const { ObjectId } = Types;

// 파일 업로드 모듈. 최대 사이즈 : 30MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 30 },
});

router.post('/excel', upload.single('file'), (req, res) => {
  const ExceFileBuffer = req.file.buffer;
  const ExcelFile = XLSX.read(ExceFileBuffer);
  let theatersArr = [];
  const rowTheater = 1;
  const rowSeat = 2;
  const colStart = 4;

  for (let i = 0; i < ExcelFile.SheetNames.length && ExcelFile.SheetNames[i] !== '상영작별'; i += 1) {
    const ExcelSheet = ExcelFile.Sheets[ExcelFile.SheetNames[i]];
    const ExcelSheetRange = XLSX.utils.decode_range(ExcelSheet['!ref'].toString());
    for (let col = colStart; col <= ExcelSheetRange.e.c; col += 1) {
      const theaterCellAddress = XLSX.utils.encode_cell({ c: col, r: rowTheater });
      const seatCellAddress = XLSX.utils.encode_cell({ c: col, r: rowSeat });
      const theater = ExcelSheet[theaterCellAddress] ? ExcelSheet[theaterCellAddress].v : '';
      const seat = ExcelSheet[seatCellAddress] ? ExcelSheet[seatCellAddress].v : '';
      if (theater !== '' && seat !== '' && Number(seat) > 0 && !theatersArr.find(obj => obj.theater === theater)) {
        theatersArr.push({
          theater,
          seat,
        });
      }
    }
  }
  theatersArr = theatersArr.sort((a, b) => a.theater.length < b.theater.length);
  const ExcelSheetIndex = ExcelFile.SheetNames.findIndex(item => item === '상영작별');
  if (ExcelSheetIndex < 0) {
    return res.status(500).json({ message: '상영작별이란 이름의 엑셀 시트를 추가하십시요'});
  }
  const ExcelSheet = ExcelFile.Sheets[ExcelFile.SheetNames[ExcelSheetIndex]];
  const ExcelSheetRange = XLSX.utils.decode_range(ExcelSheet['!ref'].toString());
  const rowStartMovie = 1;
  const colStartMovie = 1;
  const movies = [];
  for (let r = rowStartMovie; r <= ExcelSheetRange.e.r; r += 1) {
    const movieName = ExcelSheet[XLSX.utils.encode_cell({ r, c: colStartMovie })] ?
      ExcelSheet[XLSX.utils.encode_cell({ r, c: colStartMovie })].v : '';
    if (movieName && movieName !== '') {
      for (let c = colStartMovie; c <= ExcelSheetRange.e.c; c += 1) {
        const cellAddress = XLSX.utils.encode_cell({ c, r });
        const parsedCell = ExcelSheet[cellAddress] ? ExcelSheet[cellAddress].v : null;
        if (parsedCell && parsedCell !== '') {
          let month = /[0-9]+(?=월)/.exec(String(parsedCell));
          let date = /[0-9]+(?=일)/.exec(String(parsedCell));
          let hour = /[0-9]+(?=:)/.exec(String(parsedCell));
          let minute = /:([0-9]+)/.exec(String(parsedCell));
          month = month ? month[0] : null;
          date = date ? date[0] : null;
          hour = hour ? hour[0] : null;
          minute = minute ? minute[1] : null;
          let theater;
          for (const obj of theatersArr) {
            if (String(parsedCell).indexOf(obj.theater) > 0) {
              theater = obj.theater;
              break;
            }
          }
          if (!(
            (!month || month === '') ||
            (!date || date === '') ||
            (!hour || hour === '') ||
            (!minute || minute === '') ||
            (!theater || theater === ''))
          ) {
            const datetime = new Datetime(new Date());
            datetime.month = parseInt(month, 10);
            datetime.date = parseInt(date, 10);
            datetime.hour = parseInt(hour, 10);
            datetime.minute = parseInt(minute, 10);
            datetime.second = 0;
            const theaterFound = theatersArr.find(obj => obj.theater === theater);
            if (theaterFound) {
              movies.push({
                name: movieName,
                datetime: datetime.dateObject,
                theater,
                available: theaterFound.seat,
              });
            }
          }
        }
      }
    }
  }
  res.json({
    data: movies,
  });
});
// 영화 벌크 생성
router.post('/bulk', (req, res) => {
  if (!req.body.data.length) {
    return res.status(500).json({ message: '영화 생성 오류: 올바른 엑셀이 입력되지 않았습니다.' });
  }
  Movie.insertMany(req.body.data, (err, docs) => {
    if
    (err) {
      return res.status(500).json({ message: '영화 생성 오류: 올바른 값이 입력되지 않았습니다.' });
    }
    res.json({
      data: docs,
    });
  });
  return null;
});
// 영화 생성
router.post('/', (req, res) => {
  if (
    !req.body.data.name ||
    !req.body.data.year ||
    !req.body.data.month ||
    !req.body.data.date ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'hour') ||// 0이 올 수도 있으므로 프로퍼티를 검사한다.
    !Object.prototype.hasOwnProperty.call(req.body.data, 'minute')
  ) {
    return res.status(500).json({ message: '영화 생성 오류: 올바른 값이 입력되지 않았습니다.' });
  }
  const datetime = new Datetime(new Date());
  datetime.year = parseInt(req.body.data.year, 10);
  datetime.month = parseInt(req.body.data.month, 10);
  datetime.date = parseInt(req.body.data.date, 10);
  datetime.hour = parseInt(req.body.data.hour, 10);
  datetime.minute = parseInt(req.body.data.minute, 10);
  datetime.second = 0;

  const movie = new Movie({
    name: req.body.data.name,
    theater: req.body.data.theater,
    available: req.body.data.available,
    datetime: datetime.dateObject,
  });
  movie.save((err, result) => {
    if (err) {
      return res.status(500).json({ message: '영화 생성 오류: 오류가 있습니다.' });
    }
    return res.json({
      data: result,
    });
  });
  return null;
});
// 영화 반환
router.get('/:_id', (req, res) => {
  Movie.findOne({ _id: req.params._id })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '영화 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 영화 리스트 반환
router.get('/', (req, res) => {
  Movie.find({})
    .sort({ name: 1, bus: 1 })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '영화 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 영화 수정
router.put('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '영화 수정 오류: _id가 전송되지 않았습니다.' });
  } else if (
    !req.body.data.year ||
    !req.body.data.month ||
    !req.body.data.date ||
    !Object.prototype.hasOwnProperty.call(req.body.data, 'hour') ||// 0이 올 수도 있으므로 프로퍼티를 검사한다.
    !Object.prototype.hasOwnProperty.call(req.body.data, 'minute')
  ) {
    return res.status(500).json({ message: '영화 수정 오류: 시각 데이터가 전송되지 않았습니다.' });
  }
  const datetime = new Datetime(new Date());
  datetime.year = parseInt(req.body.data.year, 10);
  datetime.month = parseInt(req.body.data.month, 10);
  datetime.date = parseInt(req.body.data.date, 10);
  datetime.hour = parseInt(req.body.data.hour, 10);
  datetime.minute = parseInt(req.body.data.minute, 10);
  datetime.second = 0;
  const data = {
    name: req.body.data.name,
    theater: req.body.data.theater,
    available: req.body.data.available,
    datetime: datetime.dateObject,
  };
  const properties = [
    'name',
    'theater',
    'available',
    'datetime',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(data, property)) {
      update.$set[property] = data[property];
    }
  }
  Movie.findOneAndUpdate(
    { _id: req.body.data._id },
    update,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: '영화 수정 오류' });
      }
      return res.json({
        data: result,
      });
    },
  );
  return null;
});
// 영화 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '영화 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Reservation.deleteMany(
    {
      movie: new ObjectId(req.body.data._id),
    },
    () => {
      Movie.findOneAndRemove(
        { _id: req.body.data._id },
        (err, result) => {
          socket.emit('movieDelete', { _id: req.body.data._id });
          return res.json({
            data: result,
          });
        },
      );
    },
  );
  return null;
});
router.delete('/all', (req, res) => {
  Movie.deleteMany({}, (err, result) => {
    if (err) {
      return res.status(500).json({message: '영화 삭제 오류: DB 삭제에 문제가 있습니다.'});
    }
    return res.json({
      data: result,
    });
  });
  return null;
});
export default router;
