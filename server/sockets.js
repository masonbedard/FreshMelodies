var db = require('./db'),
	Song = db.Song;
var youtube = require('youtube-feeds');
var request = require('request');

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
		var url = new String(data.url);
           
		if (url.indexOf("youtube.com") != -1) {
			youtubeHandler(data, url);
		}
        else if (url.indexOf("soundcloud.com") != -1) {
            soundcloudHandler(data,url);
        }
		else {
	        Song.insertOrUpdate(data.name, data.artist, data.genre, data.url);
		}
	});
	socket.on('add listen', function(data) {
		Song.addListen(data.name, data.artist);
	});
}

function soundcloudHandler(data,url) {
    request('http://api.soundcloud.com/resolve.json?url='+url+'&client_id='+
      '1d59b5b795afd9b4e2ffc7144715bd05', function (error, response, body) {
         if (error != 'null') {
             var tid = JSON.parse(body).id;
             request('http://api.soundcloud.com/tracks/'+
               tid+'.json?client_id=1d59b5b795afd9b4e2ffc7144715bd05', function(error,response,body) {
                 if (error != 'null') {
                     var playback_count = JSON.parse(body).playback_count;
                     if (playback_count < 5000) {
                         Song.insertOrUpdate(data.name, data.artist, data.genre, data.url);
                     }
                     else {
                     console.log('too many have heard');
                     //let user know?
                    }
                 }
            });
        }
      });
}


function youtubeHandler(data, url) {
	var vid = youtubeLinkParser(url);	
	youtube.video(vid).details(function(err, details) {
		if (err === null) {
			console.log(details.viewCount);
			if (details.viewCount < 10000) {
			    Song.insertOrUpdate(data.name, data.artist, data.genre, data.url);
                // let client known success
			}
            else {
                console.log('too many views');
                // let client know failure
            }
		}
	});
}

function youtubeLinkParser(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return null;
  }
}

// the following is the initialization of the sockets
exports.init = function(cio) {
  var io = cio;
  io.configure('development', function(){
     io.set('transports', ['xhr-polling']);
  });
  io.sockets.on('connection', connect);
}
