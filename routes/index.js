var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

/*********************** Home Page ***********************/

//GET
router.get('/', function (req, res, next) {
    if (req.session.uid)
        res.render('index', {logged_in: true});
    else
        res.render('index', {});
});


/********************* Register Page *********************/

//GET
router.get('/register', function (req, res, next) {
    if (req.session.uid)
        res.render('register', {logged_in: true});
    else
        res.render('register', {});
});

//POST - Inserting a new user
router.post('/register', function (req, res, next) {
    var ses = req.session;
    if (ses.uid) {
        res.render('register', {logged_in: true});
        return
    }

    User.create(new User({
            accNumber: req.body.accNumber,
            pass: req.body.pass,
            gender: req.body.gender,
            balance: req.body.balance
        }), function (err, user) {
            if (err) {
                return res.render('register', {error: err});
            }
            passport.authenticate('local')(req, res, function () {
                res.render('register', {logged_in: true});
            });
        });
    res.render('login', {msg: "New user entered, please login."});
});

/*********************************************************/
module.exports = router;
