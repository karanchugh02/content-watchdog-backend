import express from 'express';
import AuthHandler from '../utils/auth';
const router = express.Router();

router.use('/organization', require('./organization'));
router.use('/home', require('./home'));
router.use('/analysis', require('./analysis'));

router.use(
  '/services',
  AuthHandler.apiServiceMiddleware,
  require('./services')
);

module.exports = router;
