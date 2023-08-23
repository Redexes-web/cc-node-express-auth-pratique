var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');
var crypto = require('crypto');

mkdirp.sync('./var/db');
var db = new sqlite3.Database('./var/db/exer.db');

db.serialize(function () {
	db.run(
		'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, hashed_password BLOB NOT NULL, salt BLOB NOT NULL, name TEXT, email TEXT UNIQUE, email_verified INTEGER DEFAULT 0)'
	);
	db.run(
		'CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE, completed INTEGER NOT NULL DEFAULT 0, owner_id INTEGER NOT NULL, FOREIGN KEY(owner_id) REFERENCES users(id))'
	);
	var salt = crypto.randomBytes(16);
	db.run(
		'INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)',
		['enzo', crypto.pbkdf2Sync('admin', salt, 310000, 32, 'sha256'), salt]
	);
});

module.exports = db;
