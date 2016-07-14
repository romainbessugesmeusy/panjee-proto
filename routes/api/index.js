var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/entities', require('./entities'));
router.use('/organizations', require('./organizations'));

module.exports = router;
