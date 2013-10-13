var db = require('./db'),
	Song = db.Song;

var connect = function(socket) {
	socket.on('populate songs', function(data) {
		console.log('pop')
		if (data.genre !== 'all') {
			Song.findByGenreAfterNum(data.genre, 0, function(err, results) {
				if (err) {
					console.log("error getting songs");
				} else {
					socket.emit('songs response', results);
					console.log(results.length);
					if (results.length != 20) {
						socket.emit('no more songs');
					}
				}
			});
		} else {
			Song.findAllAfterNum(0, function(err, results) {
				if (err) {
					console.log("error getting songs");
				} else {
					socket.emit('songs response', results);
					console.log(results.length);
					if (results.length != 20) {
						socket.emit('no more songs');
					}
				}
			});
		}
	});
	socket.on('load more songs', function(data) {
		if (data.genre !== 'all') {
			Song.findByGenreAfterNum(data.genre, data.num, function(err, results) {
				if (err) {
					console.log("error getting songs");
				} else {
					socket.emit('more songs', results);
					console.log(results.length);
					if (results.length != 20) {
						socket.emit('no more songs');
					}
				}
			});
		} else {
			console.log(data.id);
			Song.findAllAfterNum(data.num, function(err, results) {
				if (err) {
					console.log("error getting songs");
				} else {
					socket.emit('more songs', results);
					console.log(results.length);
					if (results.length != 20) {
						socket.emit('no more songs');
					}
				}
			});
		}
	});
	socket.on('submit', function(data) {
		Song.insertOrUpdate(data.name, data.artist, data.genre, data.url);
	});
	socket.on('add listen', function(data) {
		Song.addListen(data.name, data.artist);
	});
}

// the following is the initialization of the sockets
exports.init = function(cio) {
  var io = cio;
  io.configure('development', function(){
     io.set('transports', ['xhr-polling']);
  });
  io.sockets.on('connection', connect);
}
