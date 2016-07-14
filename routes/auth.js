var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();


router.get('/inscription', function (req, res) {
    res.render('inscription');
});

router.post('/inscription', function (req, res) {
    var onUserRegistered = function (err, user) {
        if (err) {
            console.info(err);
            res.render('inscription');
        }

        user.createDefaultOrganization(req.body.organization, function () {
            passport.authenticate('local')(req, res, function () {
                res.redirect('/dashboard');
            });
        });
    };

    User.register(new User(req.body), req.body.password, onUserRegistered)
});


router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/dashboard');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/invitation', function(req, res){
    res.render('invitation');
});

module.exports = router;
