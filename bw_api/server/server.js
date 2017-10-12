// 서버사이드 ajax를 위한 fetch
import 'isomorphic-fetch';
import https from 'https';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookiePasrser from 'cookie-parser';
import session from 'express-session';
import MongoConnect from 'connect-mongo';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import io from 'socket.io';
import configure from './configure';
import auth from './routes/auth';
import api from './routes';

import { Staff } from './models';

// 서버와 포트 초기화
const app = express();
const port = configure.PORT;

// CORS 해결 (개발 중 필요하여 사용, 클라이언트 파일들이 public 폴더로 빌드된 상태면, 아래 코드 없어도 무방)
if (process.env.NODE_ENV !== 'production') {
  console.log('CORS http://localhost:3000 허용(react dev server 포트 변경 시 본 코드 수정 필요)');
  const whitelist = ['http://localhost','http://localhost:3000'];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
}

// SSL (임시 방편 - 자체 SSL, 공인 인증 SSL(기관 인증) 아님)
const options = {
      key: fs.readFileSync(path.join(__dirname, '../', 'certs', 'server', 'privkey.pem'))
    , cert: fs.readFileSync(path.join(__dirname, '../', 'certs', 'server', 'fullchain.pem'))
};

// 몽고디비 연결 설정
const db = mongoose.connection;
mongoose.connect(configure.MONGO_URL, {
  useMongoClient: true,
});

// Mongoose 모듈의 Promise 변경 - 모듈 권고사항 (deprecated)
mongoose.Promise = global.Promise;

// 몽고디비 연결
db.on('error', console.error);
db.once('open', () => {
  console.log(`[MONGO DB URL] : ${configure.MONGO_URL}`);
  Staff.find({}).lean().exec((err, result) => {
    if (err) {
      console.log('DB ERROR', err);
    } else if (result.length === 0) {
      const staff = new Staff({ name: '관리자', sn: '0000', level: '관리자' });
      staff.save((err) => {
        if (err) {
          console.log('Error while inserting First Manager', err);
        }
        console.log('[First Manager Account] : 0000');
        return null;
      });
    } else {
      return null;
    }
  });
});

// 쿠키 사용
app.use(cookiePasrser());

// POST 연결을 위한 설정
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.enable('trust proxy');

// 인증
const MongoStore = MongoConnect(session);
const sessionConfig = {
  secret: configure.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// static 폴더
app.use('/', express.static(path.join(__dirname, '../', 'public')));

app.use(auth);

// API 라우트
app.use('/api', api);

// public/index 파일 라우팅
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// 404 에러
app.use((req, res) => {
  res.status(404).send('NOT FOUND');
});

// 서버 시작
let server;
if (process.env.NODE_ENV === 'production') {
  console.log('HTTPS 사용');
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}
const socket = io.listen(server);

server.listen(port, () => {
  console.log(`[SERVER PORT] : ${port}`);
});

export default socket;
