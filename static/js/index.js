(function() {
	"use strict";

	var options = Object.assign({
		room: 3321
	}, window.parent.rtc || {});
	console.log("RTC", options);

	if (!options.room) throw new Error('Room required');

	var ko = window.ko;
	var socket = io();
	var rtc = window.rtc = {};

	rtc.vm = {};
	rtc.vm.myComment = '';
	rtc.vm.comments = [];

	ko.track(rtc.vm);

	rtc.submitComment = function() {
		console.log('comment', this.myComment)
		socket.emit('comment', {
			body: this.myComment,
			parent: (this instanceof Comment && this._id) || null
		});
		this.myComment = '';
		return false;
	};

	rtc.submitVote = function(vote){
		console.log('vote', this._id, vote);
		socket.emit('vote', {
			_id: this._id,
			vote: vote
		});
	};

	rtc.vm.reply = rtc.submitComment.bind(rtc.vm);

	window.initHandler(socket);
	socket.emit('join', options.room);
	document.addEventListener("DOMContentLoaded", function(event) {
		ko.applyBindings(rtc.vm);
	});
})();
