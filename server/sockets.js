var db = require('./db'),
	Song = db.Song,
  logger = require('./logger');

var connect = function(socket) {
  logger.info("New connection from:" + socket);
  Song.findSome(function (err, results) {
    if (err) {
      logger.error("Could not load songs.");
      socket.emit("songs", []);
    } else {
      logger.info("Sending songs: " + results);
      socket.emit("songs", results);
    }
  });

  socket.on("submit", function(data) {
    logger.info("Submit called with data: " + data);
    Song.insert(data, function(err) {
      if (err) {
        logger.error("Error inserting: " + err);
      } else {
        logger.info("Successful insert, emitting 'newSong'");
        socket.emit("newSong", data);
        socket.broadcast.emit("newSong", data);
      }
    });
  });

  socket.on("loadMoreSongs", function(data) {
    Song.findSomeAfterSong(data, function(err, results) {
      if (err) {
        logger.error("Could not get songs after: " + JSON.stringify(data) + " err: " + err);
      } else {
        socket.emit("moreSongs", results);
      }
    });
  });

	// socket.on('load songs', function(data) {
	// 	if (data.genre !== 'all') {
	// 		Song.findByGenreAfterNum(data.genre, data.num, function(err, results) {
	// 			if (err) {
	// 				console.log("error getting songs");
	// 			} else {
	// 				socket.emit("more songs", results);
	// 				console.log(results.length);
	// 				if (results.length != 20) {
	// 					socket.emit('no more songs');
	// 				}
	// 			}
	// 		});
	// 	} else {
	// 		console.log(data.id);
	// 		Song.findAllAfterNum(data.num, function(err, results) {
	// 			if (err) {
	// 				console.log("error getting songs");
	// 			} else {
	// 				socket.emit('more songs', results);
	// 				console.log(results.length);
	// 				if (results.length != 20) {
	// 					socket.emit('no more songs');
	// 				}
	// 			}
	// 		});
	// 	}
	// });

	// socket.on('submit', function(data) {
 //      var url = new String(data.url);

	//   if (url.indexOf("youtube.com") != -1) {
	// 	youtubeHandler(data, url, socket);
	//   }
 //      else if (url.indexOf("soundcloud.com") != -1) {
 //        soundcloudHandler(data,url, socket);
 //      }
	//   else {
 //        socket.emit('submit result', {result: false, message:"not a youtube or soundcloud video"});
 //      }
	// });

 //  socket.on('add listen', function(data) {
 //    Song.addListen(data._id);
 //  });
}

// function soundcloudHandler(data,url,socket) {
//   return request('http://api.soundcloud.com/resolve.json?url='+url+'&client_id='+
//     '1d59b5b795afd9b4e2ffc7144715bd05', function (error, response, body) {
//       if (error != 'null') {
//         var tid = JSON.parse(body).id;
//         request('http://api.soundcloud.com/tracks/'+
//           tid+'.json?client_id=1d59b5b795afd9b4e2ffc7144715bd05', function(error,response,body) {
//           if (error != 'null') {
//             var bodyJson = JSON.parse(body);
//             var playback_count = bodyJson.playback_count;
//             var duration = bodyJson.duration / 1000;
//             console.log('duration' + duration);
//           if (playback_count < 5000) {
//             socket.emit('submit result', {result:true});
//             Song.insertOrUpdate(data.name, data.artist, data.genre, data.url);
//           } else {
//             socket.emit('submit result', {result:false, message:"too many listens"});
//           }
//         } else {
//           socket.emit('submit result', {result:false, message:"invalid video"});
//         }
//       });
//     } else {
//       socket.emit('submit result', {result:false, message:"invalid video"});
//     }
//   });
// }


// function youtubeHandler(data,url,socket) {
// 	var vid = youtubeLinkParser(url);
// 	youtube.video(vid).details(function(err, details) {
// 		if (err === null) {
//       console.log(details);
// 	    console.log(details.viewCount);
//       console.log(details.duration);
// 		  if (/*details.viewCount < 10000*/true) {
//         console.log('submit')
//         socket.emit('submit result', {result:true});
// 		    Song.insertOrUpdate(data.name, data.artist, data.genre, data.url);
// 	    } else {
//         console.log('too many views');
//         socket.emit('submit result', {result:false, message:"too many views"});
//       }
// 		} else {
//       socket.emit('submit result', {result:false, message:"invalid video"});
//     }
// 	});
// }

// function youtubeLinkParser(url) {
//   var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
//   var match = url.match(regExp);
//   if (match && match[2].length == 11) {
//     return match[2];
//   } else {
//     return null;
//   }
// }

// the following is the initialization of the sockets
exports.init = function(cio) {
  var io = cio;
  io.sockets.on('connection', connect);
}
