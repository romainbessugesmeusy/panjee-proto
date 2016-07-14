'use strict';
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: String,
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Module'},
    type: {type: String, default: 'module'},
    target: {type: String, enum: ['product', 'organization', 'user'], default: 'product'},
    title: String,
    fields: [{
        name: String,
        label: String,
        type: {type: String},
        choices: String,
        options: String,
        visible: String,
        required: String,
        value: String,
        readonly: String,
        validation: String
    }],
    picture: {
        url: String
    }
}, {timestamps: 1});
schema.index({name: 1}, {unique: true});
module.exports = mongoose.model('Module', schema);