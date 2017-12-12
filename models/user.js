var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var randToken = require('rand-token');

var User = new Schema({
    accountNumber: {type: String, unique:true},
    pass: String,
    csrfToken: {type: String, default: function() {
        return randToken.generate(16);
    }},
    gender: String,
    balance: Float64Array
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);