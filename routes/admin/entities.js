var express = require('express');
var router = express.Router();
var Module = require('../../models/module');
var Setter = require('../../models/setter');
var List = require('../../models/list');

var extend = require('extend');
router.use(function (req, res, next) {
    Module.find({}, function (err, modules) {
        List.find({}, function (err, lists) {
            Setter.find({}, function (err, setters) {
                res.locals.entities = [].concat(modules).concat(lists).concat(setters);

                res.locals.entities.sort(function (a, b) {
                    return a.name.toLowerCase() - b.name.toLowerCase();
                });

                var tree = {};

                res.locals.entities.forEach(function (entity) {
                    var parts = entity.name.split('.');
                    var ref = tree;
                    for (var i = 0; i < parts.length - 1; i++) {
                        if (typeof ref[parts[i]] === 'undefined') {
                            ref[parts[i]] = {};
                        }

                        ref = ref[parts[i]];
                    }

                    if (typeof ref[parts[parts.length - 1]] === 'undefined') {
                        ref[parts[parts.length - 1]] = {};
                    }
                    ref[parts[parts.length - 1]]._id = entity.type + '/' + entity._id.toString();
                });


                res.locals.entityTree = tree;


                res.locals.entity = {};
                next();
            });
        });
    });
});

router.get('/entities.json', function(req, res){
   res.json(res.locals.entityTree);
});

router.get('/', function (req, res) {
    res.render('admin/entities');
});


function getEntityFromType(type) {
    switch (type) {
        case 'module':
            return Module;
        case 'list':
            return List;
        case 'setter':
            return Setter;
    }
    throw new Error('undefined entity type ' + type);
}
router.post('/:type', function (req, res) {

    getEntityFromType(req.params.type).create(req.body, function (err, entity) {
        res.json(err || entity);
    });
});

router.put('/:type/:entity', function (req, res) {
    getEntityFromType(req.params.type).findOne({_id: req.params.entity}, function (err, entity) {
        extend(entity, req.body);
        entity.save(function (err, entity) {
            res.json(err || entity);
        });
    });
});

router.get('/:type/new', function (req, res) {
    res.render('admin/entities/' + req.params.type);
});

router.get('/:type/:entity', function (req, res) {
    getEntityFromType(req.params.type).findOne({_id: req.params.entity}, function (err, entity) {
        res.render('admin/entities/' + req.params.type, {entity: entity});
    });
});

module.exports = router;
