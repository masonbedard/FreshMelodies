var express = require('express')
  , http = require('http')
  , connect = require('connect')
  , sockets = require('./sockets');

var staticServer = connect()
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(connect.cookieParser());

var app = express();

app.configure(function() {
  app.use(staticServer);
  app.use(express.errorHandler());
  app.use(express.bodyParser());
});

var server = http.createServer(app);

var cio = require('socket.io').listen(server);

server.listen(80);

sockets.init(cio);

