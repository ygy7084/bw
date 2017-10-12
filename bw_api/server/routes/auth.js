import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import { Staff } from '../models';

const router = express.Router();

const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy((username, sn, done) => {
  Staff.findOne({ sn }, (err, staff) => {
    if (err) { return done(err); }
    if (!staff) {
      return done(null, false, { message: 'Incorrect sn.' });
    }
    return done(null, staff);
  });
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) res.status(500).json(err);
    if (!user) { return res.status(400).json(info.message); }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.json({
        data: user,
      });
    });
  })(req, res, next);
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    return res.send({
      data: true,
    });
  });
});

router.get('/auth', (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: '로그인하십시요.' });
  }
  req.user.cookie = req.headers.cookie;
  return res.json({ data: req.user });
});

router.use((req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }
  next();
});

export default router;
