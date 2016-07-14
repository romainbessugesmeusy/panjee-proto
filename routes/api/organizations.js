var express = require('express');
var router = express.Router();
var Organization = require('../../models/organization');
var Product = require('../../models/product');
var extend = require('extend');

var jsonCb = function (res) {
    return function (err, data) {
        return res.json(err || data);
    }
};

/* GET users listing. */
router.get('/', function (req, res) {
    Organization.find({}, jsonCb(res));
});

router.post('/', function (req, res) {
    req.body.createdAt = new Date();
    Organization.create(req.body, jsonCb(res));
});

router.get('/:orgId', function (req, res) {
    Organization.findOne({_id: req.param('orgId')}, jsonCb(res));
});

router.get('/:orgId/products', function (req, res) {
    Organization.findOne({_id: req.param('orgId')}).populate('products').exec(function (err, org) {
        res.json(err || org.products);
    });
});

router.post('/:orgId/products', function (req, res) {
    Organization.findOne({_id: req.param('orgId')}).exec(function (err, org) {
        Product.create(req.body, function (err, product) {
            org.products.push(product._id);
            org.save(function () {
                res.json(product);
            });
        });
    });
});
router.put('/:orgId/products/:productId', function (req, res) {
    Product.findOne({_id: req.param('productId')}).exec(function (err, product) {
        product.name = req.body.name;
        product.props = req.body.props;
        product.markModified('props');
        product.save(jsonCb(res));
    });
});

router.put('/:orgId', function (req, res) {
    Organization.findOne({_id: req.param('orgId')}, function (err, org) {
        extend(org, req.body, {modifiedAt: new Date});
        org.modifiedAt = new Date();
        org.markModified('props');
        org.save(jsonCb(res));
    });
});

module.exports = router;
