import express from 'express';
const router = express.Router();

router.use('/organization', require('./organization'));
router.use('/home', require('./home'));
router.use('/analysis', require('./analysis'));

module.exports = router;
