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

	rtc.submit = function() {
        console.log('emit', rtc.vm.myComment)
		socket.emit('comment', rtc.vm.myComment);
		rtc.vm.myComment = '';
		return false;
	};

	window.initHandler(socket);
    socket.emit('join', options.room);
	document.addEventListener("DOMContentLoaded", function(event) {
		ko.applyBindings(rtc.vm);
	});
})();
