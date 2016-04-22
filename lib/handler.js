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
                socket.emit('initial', {
                    docs: docs.map((d) => {
                        d.ups = d.ups.map((id) => String(id) == String(session.user._id));
                        d.downs = d.downs.map((id) => String(id) == String(session.user._id));
                        return d;
                    })
                });
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
            comment.user = socket.request.session.user._id;
            comment.room = room;
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

        socket.on('vote', (data) => {
            if(!isLogged()) return Log('vote', 'not logged in');
            if(!room) return socket.emit('err', 'DOES_NOT_CONNECTED_TO_ANY_ROOM');
            if(['up', 'down'].indexOf(data.vote) < 0) return socket.emit('err', 'WAT');
            Comment.vote(data._id, data.vote, session.user._id)
            .then(doc => {
                io.to(room).emit('vote', {
                    _id: doc._id,
                    ups: doc.ups.map((id) => String(id) == String(session.user._id)),
                    downs: doc.downs.map((id) => String(id) == String(session.user._id))
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
