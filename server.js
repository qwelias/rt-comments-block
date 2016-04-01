"use strict";

const express = require('express');
const socket = require('socket.io');
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Path = require('path');
const config = require('./config');
const handler = require('./lib/handler');
const Log = require('debug')('app');

const app = express();
const http = require('http').Server(app);
const io = socket(http);

mongoose.Promise = global.Promise;

mongoose.connect(config.db.url);
const db = mongoose.connection;

const userMiddlware = require('./lib/user');
const sessionMiddleware = session(Object.assign(config.session, {
	store: new MongoStore({
		mongooseConnection: db
	})
}));

app.configure('development', () => {
    app.use(express.static(Path.join(config.root, 'static')));
});

io.use((socket, next) => sessionMiddleware(socket.request, socket.request.res, next));
io.use((socket, next) => userMiddlware(socket.request, socket.request.res, next));

handler.attach(io);

http.listen(config.PORT, () => {
	Log('listening on ', config.PORT);
});
