var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db');

passport.use(
	new LocalStrategy(function verify(username, password, cb) {
		db.get(
			'SELECT * FROM users WHERE username = ?',
			[username],
			function (err, row) {
				if (err) {
					return cb(err);
				}
				if (!row) {
					return cb(null, false, { message: 'Incorrect username or password' });
				}
				crypto.pbkdf2Sync(
					password,
					row.salt,
					310000,
					32,
					'sha256',
					function (err, hashedPassword) {
						if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
							return cb(null, false, {
								message: 'Incorrect username or password',
							});
						}
						return cb(null, row);
					}
				);
			}
		);
	})
);

router.get('/login', function (req, res, next) {
	res.render('login', { title: 'Login' });
});

router.post(
	'/login/password',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
	})
);
module.exports = router;
