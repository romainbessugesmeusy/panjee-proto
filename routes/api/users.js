var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var extend = require('extend');

var jsonCb = function(res){
    return function(err, data){
        return res.json(err || data);
    }
};

/* GET users listing. */
router.get('/', function(req, res) {
    User.find({}, jsonCb(res));
});

router.post('/', function(req, res){
    req.body.createdAt = new Date();
    User.create(req.body, jsonCb(res));
});

router.get('/:userId', function(req, res){
    User.findOne({_id: req.param('userId')}, jsonCb(res));
});

router.put('/:userId', function(req, res){
    User.findOne({_id: req.param('userId')}, function(err, user){
        extend(user, req.body, {modifiedAt: new Date});
        user.modifiedAt = new Date();
        // todo markModified('data')
        user.save(jsonCb(res));
    });
});

module.exports = router;
