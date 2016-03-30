"use strict";

const Log = require("debug")("app:user");
const mongoose = require("mongoose");
const config = require('../config');

mongoose.Promise = global.Promise;

const User = mongoose.model(config.db.user.model, {});

module.exports = (req, res, next) => {
	let _id = req.session && req.session.passport && req.session.passport[config.db.user.model];
	Log('current', _id);
	if(!_id) next();

	User.findOne({
		_id: _id
	}).exec()
	.then(user => {
		req.session.user = user;
		next();
	})
	.catch(e => {
		Log(e.stack || e);
		res.status(500).end();
	});
};
