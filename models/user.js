var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var randToken = require('rand-token');

var User = new Schema({
    accNumber: {type: String, unique:true, required: true, index: true},
    pass: {type: String, required: true},
    csrfToken: {type: String, default: function() {
        return randToken.generate(16);
    }},
    gender: String,
    balance: Number
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);