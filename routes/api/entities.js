var express = require('express');
var router = express.Router();
var List = require('../../models/list');
var extend = require('extend');

var jsonCb = function(res){
    return function(err, data){
        return res.json(err || data);
    }
};

router.get('/list/:name', function(req, res) {
    List.findOne({name: req.params.name}, jsonCb(res));
});

module.exports = router;
