var express = require('express');
var router = express.Router();
var User = require('../models/user');

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
    if (req.session.uid) {
        res.render('register', {logged_in: true});
        return
    }
    User.register(new User({
            username: req.body.accNumber,
            gender: req.body.gender,
            balance: req.body.balance
        }),
        req.body.password, function (err, user) {
            if (err) {
                return res.render('register', {error: err});
            }
            passport.authenticate('local')(req, res, function () {
                res.redirect('register', {logged_in: true});
            });
        });
});

/*********************************************************/
module.exports = router;
