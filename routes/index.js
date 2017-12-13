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
            res.render('login', {msg: "New user entered, please login."});
        });
    });
    res.render('login', {msg: "New user entered, please login."});
});

/*********************************************************/


/********************* login Page *********************/

//GET
router.get('/login', function (req, res, next) {
    if (req.session.uid)
        res.render('login', {logged_in: true});
    else
        res.render('login', {});
});

//POST - Inserting a new user
router.post('/login', function (req, res) {
    var ses = req.session;
    if (ses.uid) {
        res.render('login', {logged_in: true});
        return
    }
    var promise = User.findOne({accNumber: req.body.accNumber}).exec();
    promise.then(function (user) {
        console.log("-----------------" + user._id + " Logged In ----------------------");
        req.session.uid = user._id;
        res.redirect('/');
    })
});


/*********************************************************/


/********************* Transfer money Page *********************/

//GET
router.get('/transferMoney', function (req, res, next) {
    if (req.session.uid) {
        if (req.query.amountMoney == undefined) {
            res.render('transferMoney', {});
        }
        else {
            if (checkAuth(req, res)) {
                var promise = User.findOne({_id: req.session.uid}).exec();
                promise.then(function (user) {
                    console.log("*****************************************************************");
                    console.log("amount: " + req.query.amountMoney + ",  account number: " + req.query.acountNumber + " from: " + user.accNumber);
                    console.log("*****************************************************************");
                    res.redirect('transferMoney');
                });
            }
        }
    }
    else {
        console.log("--------- not logged in ---------------");
        res.redirect('/');
    }
});

//POST - transfer money
router.post('transferMoney', checkAuth, function (req, res) {

    var promise = User.findOne({_id: req.session.uid}).exec();
    promise.then(function (user) {
        console.log("amount: " + req.body.amountMoney + ",  account number: " + req.body.acountNumber + " from: " + user.accNumber);
        req.session.uid = user._id;
        res.redirect('/');
    });


    console.log("amount: " + req.body.amountMoney + ",  account number: " + req.body.acountNumber + " from: " + req.user.username);
});

/*********************************************************/

/*********** PROTECTED TRANSFER MONEY *******************/

router.get('/protectedTransferMoney', function (req, res, next) {
    if (req.session.uid) {
        if (req.query.amountMoney == undefined) {
            var promise2 = User.findOne({_id: req.session.uid}).exec();
            promise2.then(function (user) {
                var tok = user.csrfToken;
                return res.render('protectedTransferMoney', {token: tok});
            });
        }
        else {
            var tok = req.query.tok;
            var promise = User.findOne({_id: req.session.uid}).exec();
            promise.then(function (user) {
                if (tok === user.csrfToken) {
                    console.log("*****************************************************************");
                    console.log("amount: " + req.query.amountMoney + ",  account number: " + req.query.acountNumber + " from: " + user.accNumber);
                    console.log("*****************************************************************");
                    res.redirect('protectedTransferMoney');
                } else {
                    console.log("##################################################################");
                    console.log("HACKING ATTEMPT PREVENTED, MOST SECURE BANK IN BIU!!!");
                    console.log("##################################################################");
                    res.send('Wrong token, no money for you >:(');
                }

            });
        }
    }
    else {
        console.log("--------- not logged in ---------------");
        res.redirect('/');
    }
});

/********************************************************/


function checkAuth(req, res, next) {
    if (!req.session.uid) {
        console.log("---------------------you are not authenticate----------------");
        return false;
    } else {
        console.log("---------------you are authenticate-----------------");
        return true;
    }
}

module.exports = router;
