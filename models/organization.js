'use strict';
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: String,
    address: {
        lines: [String],
        postalCode: String,
        city: String,
        country: String
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    props: mongoose.Schema.Types.Mixed
}, {timestamps: true, id: false});

schema.methods.isUserAdmin = function (user) {
    var isAdmin = false;
    this.admins.forEach(function (adminId) {
        if (adminId.toString() === user._id.toString()) {
            isAdmin = true;
        }
    });
    return isAdmin;
};
module.exports = mongoose.model('Organization', schema);