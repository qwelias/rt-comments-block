"use strict";

const Comment = require('./comment');
const config = require('../config');
const Log = require('debug')('app:handler');

const attach = (io) => {
    Log('init');

    io.on('connection', (socket) => {
    	Log('a user connected');
    	let room;

        const session = socket.request.session;
        const isLogged = () => !!session.user;

    	socket.on('disconnect', () => {
    		Log('user disconnected');
    	});

        socket.on('leave', () => {
            if(!isLogged()) return Log('leave', 'not logged in');
            Log(`leave room ${room}`);
            room = null;
            socket.leave(room);
        });

    	socket.on('join', (join) => {
            if(!isLogged()) return Log('join', 'not logged in');
    		room = String(join);
    		socket.join(room);
            Comment.getByRoom(room)
            .then(docs => {
                Log(`Found ${docs.length} comments`);
                socket.emit('initial', docs);
            })
            .catch(e => {
                Log(e.stack || e);
                socket.emit('err', 'CAN_NOT_GET_ROOM_COMMENTS');
            });
    		Log('join room ', room);
    	});

    	socket.on('comment', (comment) => {
            if(!isLogged()) return Log('comment', 'not logged in');
            if(!room) return socket.emit('err', 'DOES_NOT_CONNECTED_TO_ANY_ROOM');
            comment = {body: comment};
            comment.user = socket.request.session.user._id;
            comment.room = room;
            comment.ups = [session.user._id];
    		Log('comment ', comment);
            Comment.add(comment)
            .then(comment => comment.populate('user').execPopulate())
            .then(comment => {
                comment = comment.toObject();
                comment.user = config.db.user.getName(comment.user);
                io.to(room).emit("comment", comment);
            })
            .catch(e => {
                Log(e.stack || e);
                socket.emit('err', 'CAN_NOT_ADD_COMMENT');
            });
    	});

        socket.on('vote', (_id, vote) => {
            if(!isLogged()) return Log('vote', 'not logged in');
            if(!room) return socket.emit('err', 'DOES_NOT_CONNECTED_TO_ANY_ROOM');
            if(['up', 'down'].indexOf(vote) < 0) return socket.emit('err', 'WAT');
            Comment.vote(_id, vote, session.user._id)
            .then(doc => {
                io.to(room).emit('vote', {
                    _id,
                    ups: doc.ups,
                    downs: doc.downs
                });
            })
            .catch(e => {
                Log(e.stack || e);
                socket.emit('err', 'CAN_NOT_VOTE_PROPERLY');
            });
        });
    });
};

module.exports = {attach};
