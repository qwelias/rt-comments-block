"use strict";

const mongoose = require('mongoose');
const createdModifiedPlugin = require('mongoose-createdmodified').createdModifiedPlugin;
const config = require('../config');
const Log = require('debug')('app:rtcomment');

const schema = new mongoose.Schema({
	body: {
		type: String,
		required: true,
		text: true,
		trim: true
	},
    room:{
        type: String,
		required: true,
		text: true,
		trim: true
    },
	ups: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: config.db.user.model
	}],
	downs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: config.db.user.model
	}],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: config.db.user.model,
		required: true
	},
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'rtcomment',
        default: null
	}
}).plugin(createdModifiedPlugin, {
	index: true
});

schema.static('getByRoom', function(room){
    return this.find({room}).populate('user', config.db.user.fields.join(' ')).lean().exec()
	.then(docs => {
		return docs.map(doc => {
			doc.user = config.db.user.getName(doc.user);
			return doc;
		});
	});
});
schema.static('add', function(comment){
	return this.create(comment);
});
schema.static('vote', function(_id, vote, user){
	return this.findOne({_id}).exec()
	.then(doc => {
		doc[vote+'s'].addToSet(user);
		return doc.save();
	});
});

module.exports = mongoose.model('rtcomment', schema);
