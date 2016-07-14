'use strict';
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    identifier: String,
    products: [mongoose.Schema.Types.ObjectId],
    props: mongoose.Schema.Types.Mixed,
    createdAt: Date,
    modifiedAt: Date
}, { id: false });
schema.index({ username: 1 }, { unique: true });
schema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', schema);