var comm = {};
comm.socket = io.connect(window.location.href);

comm.socket.emit('load songs',{'genre':model.genre, 'num':model.num});
$("#loading-spinner").addClass("loading-spinner-visible");

comm.socket.on('no more songs', function() {
  model.more_songs = false;
});

comm.socket.on('more songs', function(data) {
  model.createEntries(data);
});

comm.socket.on("submit result", function(data) {
  model.submission_results(data);
});
