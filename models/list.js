'use strict';
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: String,
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'List'},
    type: {type: String, default: 'list'},
    items: [{
        name: String,
        label: String
    }]
}, {timestamps: 1});
schema.index({name: 1}, {unique: true});
module.exports = mongoose.model('List', schema);
