const express = require('express');
const router = express.Router();
const cookers = require('./api/cookers');
const lineHooks = require('./api/lineHooks');

router.use('/cookers', cookers);
router.use('/lineHooks', lineHooks);

router.get('/', (req, res) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send('This is IoT Rice API');
});
router.post('/', (req, res) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send('This is IoT Rice API');
});
router.put('/', (req, res) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send('This is IoT Rice API');
});

module.exports = router;
