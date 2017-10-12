import express from 'express';

import customer from './customer';
import staff from './staff';
import bus from './bus';
import history from './history';
import movie from './movie';
import reservation from './reservation';
import work from './work';
import theater from './theater';

const router = express.Router();

router.use('/customer', customer);
router.use('/staff', staff);
router.use('/bus', bus);
router.use('/history', history);
router.use('/movie', movie);
router.use('/reservation', reservation);
router.use('/work', work);
router.use('/theater', theater);

export default router;
