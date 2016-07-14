var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/entities', require('./entities'));

module.exports = router;
