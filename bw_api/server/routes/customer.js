import express from 'express';
import XLSX from 'xlsx';
import multer from 'multer';
import tmp from 'tmp';
import { Types } from 'mongoose';
import socket from '../server';
import {
  Customer,
  Reservation,
} from '../models';

const { ObjectId } = Types;


const router = express.Router();

// 파일 업로드 모듈. 최대 사이즈 : 30MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 30 },
});

router.post('/excel', upload.single('file'), (req, res) => {
  const ExceFileBuffer = req.file.buffer;
  const ExcelFile = XLSX.read(ExceFileBuffer);

  const ExcelSheet = ExcelFile.Sheets[ExcelFile.SheetNames[0]];
  const ExcelSheetRange = XLSX.utils.decode_range(ExcelSheet['!ref'].toString());
  const columnsParser = {
    bus: {
      index: 2,
      regex: /[0-9]+/,
    },
    name: {
      index: 7,
    },
  };
  const customers = [];
  try {
    for (let r = ExcelSheetRange.s.r + 1; r <= ExcelSheetRange.e.r; r += 1) {
      const customer = {};
      for (const col in columnsParser) {
        const cellAddress = XLSX.utils.encode_cell({ c: columnsParser[col].index, r });
        let parsedString = ExcelSheet[cellAddress].v;
        const { regex } = columnsParser[col];
        if (regex) {
          parsedString = regex.exec(parsedString)[0];
        }
        customer[col] = parsedString;
      }
      customers.push(customer);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: '엑셀 입력 오류: 올바른 엑셀이 입력되지 않았습니다.' });
  }
  for (const obj of customers) {
    if (!obj ||
       !(Object.prototype.hasOwnProperty.call(obj, 'bus') || obj.bus === '' ||
       !(Object.prototype.hasOwnProperty.call(obj, 'name') || obj.name === ''))) {
      return res.status(500).json({ message: '엑셀 입력 오류: 올바른 엑셀이 입력되지 않았습니다.' });
    }
  }
  return res.json({ data: customers });
});
// 고객 벌크 생성
router.post('/bulk', (req, res) => {
  if (!req.body.data.length) {
    return res.status(500).json({ message: '고객 생성 오류: 올바른 엑셀이 입력되지 않았습니다.' });
  }
  Customer.insertMany(req.body.data, (err, docs) => {
    const bulkUpdateArr = [];
    for (const obj of docs) {
      bulkUpdateArr.push({
        updateOne: {
          filter: { _id: obj._id },
          update: {
            barcode_id: String(obj._id),
          },
        },
      });
    }
    Customer.bulkWrite(bulkUpdateArr).then(result => res.json({ data: result }));
  });
  return null;
});
// 고객 생성
router.post('/', (req, res) => {
  if (!req.body.data.name) {
    return res.status(500).json({ message: '고객 생성 오류: 올바른 값이 입력되지 않았습니다.' });
  }
  const customer = new Customer(req.body.data);
  customer.save((err, result) => {
    if (err) {
      return res.status(500).json({ message: '고객 생성 오류: 중복된 번호 혹은 바코드 ID가 존재하거나 오류가 있습니다.' });
    }
    if (!result.barcode_id || result.barcode_id === '') {
      Customer.findOneAndUpdate(
        { _id: result._id },
        {
          $set: { barcode_id: String(result._id) },
        },
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: '고객 생성 오류: 바코드 생성 과정에 오류가 있습니다.' });
          }
          socket.emit('customerCreate', result);
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
  return null;
});
// 고객 반환
router.get('/barcode/:barcode_id', (req, res) => {
  Customer.findOne({ barcode_id: req.params.barcode_id })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '고객 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 고객 리스트 엑셀 반환
router.get('/exceldownload', (req, res) => {
  Customer.find({})
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '고객 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      const wb = XLSX.utils.book_new();
      const ws_name = 'customers';
      const ws_data = [
        [ '번호', '이름', '전화번호', '지정버스', '바코드ID' ],
      ];
      let i = 0;
      for (const obj of result) {
        i += 1;
        for (const prop in obj) {
          obj[prop] = obj[prop] ? obj[prop] : '';
        }
        ws_data.push([
          i,
          obj.name,
          obj.phone,
          obj.bus,
          obj.barcode_id,
        ]);
      }
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      tmp.file((error, path) => {
        if (error) {
          return res.status(500).json({ message: '엑셀 생성 오류: 오류가 있습니다.', error });
        }
        XLSX.writeFile(wb, path);
        return res.download(path, 'customers.xlsx');
      });
    });
});
// 고객 반환
router.get('/:_id', (req, res) => {
  Customer.findOne({ _id: req.params._id })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '고객 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 고객 리스트 반환
router.get('/', (req, res) => {
  Customer.find({})
    .sort({ bus: 1 })
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({ message: '고객 리스트 조회 오류: 검색에 오류가 있습니다.' });
      }
      return res.json({
        data: result,
      });
    });
});
// 고객 수정
router.put('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '고객 수정 오류: _id가 전송되지 않았습니다.' });
  }
  const properties = [
    'name',
    'phone',
    'barcode_id',
    'bus',
    'enteringBus',
    'outgoingBus',
    'state',
  ];
  const update = { $set: {} };
  for (const property of properties) {
    if (Object.prototype.hasOwnProperty.call(req.body.data, property)) {
      update.$set[property] = req.body.data[property];
    }
  }
  Customer.findOneAndUpdate(
    { _id: req.body.data._id },
    update,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: '고객 수정 오류: 전화 번호가 중복되거나 바코드 아이디가 중복됩니다.' });
      }
      const socketData = req.body.data;
      socketData.bus = parseInt(socketData.bus, 10);
      socketData.enteringBus = parseInt(socketData.enteringBus, 10);
      socketData.outgoingBus = parseInt(socketData.outgoingBus, 10);
      socket.emit('customerUpdate', socketData);
      return res.json({
        data: result,
      });
    },
  );
  return null;
});
// 고객 삭제
router.delete('/', (req, res) => {
  if (!req.body.data._id) {
    return res.status(500).json({ message: '고객 삭제 오류: _id가 전송되지 않았습니다.' });
  }
  Reservation.deleteMany(
    {
      customer: new ObjectId(req.body.data._id),
    }, () => {
      Customer.findOneAndRemove(
        { _id: req.body.data._id },
        (err, result) => {
          socket.emit('customerDelete', { _id: req.body.data._id });
          return res.json({
            data: result,
          });
        },
      );
    });
  return null;
});
router.delete('/all', (req, res) => {
  Customer.deleteMany({}, (err, result) => {
    if (err) {
      return res.status(500).json({message: '고객 삭제 오류: DB 삭제에 문제가 있습니다.'});
    }
    return res.json({
      data: result,
    });
  });
  return null;
});

export default router;
