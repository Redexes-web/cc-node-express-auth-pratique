var express = require('express');
var db = require('../db');
var router = express.Router();

router.get('/index', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/', function (req, res, next) {
	res.render('home', { title: 'Express' });
});

module.exports = router;