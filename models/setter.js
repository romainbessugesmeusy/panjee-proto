'use strict';
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: String,
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Setter'},
    type: {type: String, default: 'setter'},
    setters: [{
        name: String,
        value: String
    }]
}, {timestamps: 1});
schema.index({name: 1}, {unique: true});
module.exports = mongoose.model('Setter', schema);