'use strict';
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Organization = require('./organization');

var schema = new mongoose.Schema({
    profession: String,
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    approved: {type: Boolean, default: false},
    props: mongoose.Schema.Types.Mixed
}, {id: false, timestamps: true});
schema.index({username: 1}, {unique: true});
schema.index({email: 1}, {unique: true});
schema.plugin(passportLocalMongoose);
schema.methods.createDefaultOrganization = function (payload, cb) {
    Organization.create({
        name: payload.name,
        address: payload.address,
        legalForm: payload.legalForm,
        activitySector: payload.activitySector,
        admins: [this._id]
    }, function (err, organization) {
        if (err) {
            console.error('Could not create default organization', err);
        } else {
            console.info('Default organization created', organization);
        }
        cb();
    });
};
schema.methods.addToOrganization = function (organizationId, cb) {
    var self = this;
    Organization.findOne({_id: organizationId}, function (err, org) {
        if (err || !org) {
            console.error('Could not find organisation', organizationId);
            if(cb) {
                cb();
            }
            return;
        }
        org.admins.push(self._id);
        org.save(function (err) {
            if (err) {
                console.error('Could not add user as organization admin')
            }
            if(cb) {
                cb();
            }
        });
    });
};

schema.methods.getOrganizations = function(cb){
    Organization.find({admins: this._id}, cb);
};

module.exports = mongoose.model('User', schema);