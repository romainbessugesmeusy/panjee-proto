'use strict';
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: String,
    altNames: [String],
    template: Boolean,
    picture: {
        url: String
    },
    props: mongoose.Schema.Types.Mixed,
    createdAt: Date,
    modifiedAt: Date
}, { id: false });
module.exports = mongoose.model('Product', schema);