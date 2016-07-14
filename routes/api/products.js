var express = require('express');
var router = express.Router();
var Product = require('../../models/product');
var extend = require('extend');

var jsonCb = function(res){
    return function(err, data){
        return res.json(err || data);
    }
};

/* GET users listing. */
router.get('/', function(req, res) {
    Product.find({}, jsonCb(res));
});

router.post('/', function(req, res){
    req.body.createdAt = new Date();
    Product.create(req.body, jsonCb(res));
});

router.get('/:productId', function(req, res){
    Product.findOne({_id: req.param('productId')}, jsonCb(res));
});

router.put('/:productId', function(req, res){
    Product.findOne({_id: req.param('productId')}, function(err, product){
        extend(product, req.body, {modifiedAt: new Date});
        product.modifiedAt = new Date();
        product.markModified('props');
        product.save(jsonCb(res));
    });
});

module.exports = router;
