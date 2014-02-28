define(['socket.io', 'classie'], function(io, classie) {
  var socket = io.connect(window.location.href),
      target = document.getElementById('loading-spinner');

  socket.emit('load songs',{'genre':'all', 'num':20});

  socket.on('no more songs', function() {
    console.log('no more');
    classie.removeClass(target, "loading-spinner-visible");
    //model.more_songs = false;
  });

  socket.on('more songs', function(data) {
    console.log(data);
    classie.removeClass(target, "loading-spinner-visible");
    //model.createEntries(data);
  });

  socket.on("submit result", function(data) {
    console.log(data)
    //model.submission_results(data);
  });
});
