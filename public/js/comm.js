define(['socket.io', 'classie', 'view'], function(io, classie, view) {
  var socket = io.connect(window.location.href),
      target = document.getElementById('loading-spinner');

  var submitSong = function(song) {
    socket.emit('submit', song);
  };

  var loadSongs = function(genre, num) {
    socket.emit('load songs',{genre:genre, num:num});
  };

  var addListen = function(id) {
    socket.emit('add listen',{'_id':id});
  };

  var init = function(songmanager) {
    loadSongs('all', 0);

    socket.on('no more songs', function() {
      console.log('no more');
      classie.removeClass(target, "loading-spinner-visible");
      songmanager.more_songs = false;
    });

    socket.on("submit result", function(data) {
    console.log(data)
      if (data.result) {
        view.successfulSongSubmission();
      } else {
        view.unsuccessfulSongSubmission(data);
      }
    });

    socket.on('more songs', function(data) {
      console.log(data);
      classie.removeClass(target, "loading-spinner-visible");
      songmanager.createEntries(data);
    });
  };

  return {
    init: init,
    submitSong: submitSong,
    loadSongs: loadSongs,
    addListen: addListen
  };
});
