var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');

//models
var Organization = require('../models/organization');
var Module = require('../models/module');
var Product = require('../models/product');

router.use('/', require('./auth'));

function setCurrentOrganizationFromSession(req, res, foundCb, notFoundCb) {
    Organization.findOne({_id: req.session.currentOrganization}).populate('admins').exec(function (err, currentOrganization) {
        if (!err && currentOrganization) {
            req.currentOrganization = currentOrganization;
            res.locals.organization = req.currentOrganization;
            return foundCb();
        }
        notFoundCb();
    });
}

function getUserOrganizations(req, res, useDefaultOrg, next) {
    res.locals.user = req.user;
    req.user.getOrganizations(function (err, userOrganizations) {
        req.user.organizations = userOrganizations;
        if (useDefaultOrg) {
            req.currentOrganization = userOrganizations[0];
            res.locals.organization = req.currentOrganization;
        }
        next();
    });
}


router.use(function (req, res, next) {
    if (!req.user) {
        return next();
    }
    if (req.session.currentOrganization) {
        setCurrentOrganizationFromSession(req, res, function orgFoundInSession() {
            getUserOrganizations(req, res, false, next);
        }, function orgNotFoundInSession() {
            getUserOrganizations(req, res, true, next);
        });
    } else {
        getUserOrganizations(req, res, true, next);
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express', user: req.user});
});

router.get('/dashboard', function (req, res) {
    Module.find({}, function (err, modules) {
        res.render('dashboard', {modules: modules});
    })
});

router.get('/organizations/new', function (req, res) {
    res.render('organizations/new')
});

router.post('/organizations/new', function (req, res) {
    if (!req.user) {
        return res.redirect('/');
    }
    Organization.create(req.body.organization, function (err, org) {
        req.user.addToOrganization(org._id, function () {
            res.redirect('/organizations/' + org._id);
        });
    });
});

var listOrganizations = function (req, res, next) {
    Organization.find({}).exec(function (err, organizations) {
        res.locals.organizations = organizations;
        next();
    });
};

var listProductModules = function (req, res, next) {
    console.info('listProducModules');
    Module.find({}, function (err, modules) {
        console.dir(modules);
        console.dir(err);
        res.locals.modules = modules;
        next();
    });
};

router.use('/organizations/:organizationId', function (req, res, next) {
    Organization.findOne({_id: req.params.organizationId})
        .populate('admins')
        .populate('products')
        .exec(function (err, org) {
            if (err) {
                return next();
            }
            req.session.currentOrganization = org._id.toString();
            req.currentOrganization = org;
            res.locals.organization = org;
            next();
        });
});

router.get('/organizations/:organizationId/edit', function (req, res, next) {
    res.render('organizations/edit');
});

router.get('/organizations/:organizationId', function (req, res, next) {
    res.render('organization')
});

router.get('/organizations/:organizationId/new-product', listOrganizations, listProductModules, function (req, res, next) {
    res.render('organizations/newProduct');
});

router.get('/organizations/:organizationId/products/:productId', listOrganizations, listProductModules, function (req, res, next) {
    Product.findOne({_id: req.params.productId}, function (err, product) {
        res.render('organizations/editProduct', {product: product});
    });
});


module.exports = router;
