var loading = true;
var genre = 'all';
var more_songs = true;

var comm = {};
comm.count = 0;
comm.playing_id  = undefined;
comm.entries = {};
comm.socket = io.connect(window.location.href);
comm.socket.emit('load songs',{'genre':'all', 'num':0});
$("#loading-spinner").addClass("loading-spinner-visible");

comm.socket.on('no more songs', function() {
  more_songs = false;
});

comm.createEntries = function(data) {
  var text = '';
  for (var i=0;i<data.length;i++) {
    if (!comm.entries[data[i]._id]) {
      text += "<div class='entry' id='" + data[i]._id + "'>" +
               "<span class='field'>\"" + data[i].name + "\"</span>";

      text += "<div class='controlcontainer'>" +
                "<i class='icon-play control play'></i>" +
                "<i class='icon-backward control rewind'></i>" +
              "</div>" +
              "<br>";

      text += "<span class='field'>" + data[i].artist + "</span><br>" +
              "<span class='field'>" + data[i].genre +  "</span></div><br>";

      var entry = {};
      entry.name = data[i].name;
      entry.artist = data[i].artist;
      entry.url = data[i].url;
      entry.player = CreatePlayer(data[i]._id, data[i].url);
      entry.playing = false;
      comm.entries[data[i]._id] = entry;
    }
  }
  jq.songsContainer.append(text);
  comm.count += data.length + 1;
  loading = false;
  $("#loading-spinner").removeClass("loading-spinner-visible");
};

comm.socket.on('more songs', function(data) {
  comm.createEntries(data);
});

comm.playSong = function(id) {
  if (comm.playing_id != undefined) { // song playing, stop it
    comm.pauseSong(comm.playing_id);
  }
  var entry = comm.entries[id];
  entry.player.play();
  entry.playing = true;
  comm.playing_id = id;
  $("#" + id + " .play").removeClass("icon-play").removeClass("play")
         .addClass("icon-pause").addClass("pause");
  comm.entries[id].playing = true;
}

comm.pauseSong = function(id) {
  var entry = comm.entries[id];
  if (entry.playing) {
    entry.player.pause();
    comm.playing_id = undefined;
    $("#" + id + " .pause").removeClass("icon-pause").removeClass("pause")
           .addClass("icon-play").addClass("play");
    entry.playing = false;
  }
}

comm.rewindSong = function(id) {
  var entry = comm.entries[id];
  entry.player.rewind();
}

jq.doc.on('click', '.pause', function() {
  var id = $(this).parent().parent().attr('id');
  comm.pauseSong(id);
});

jq.doc.on('click', '.rewind', function() {
  var id = $(this).parent().parent().attr('id');
  comm.rewindSong(id);
});

jq.doc.on('click', '.play', function() {
  var id = $(this).parent().parent().attr('id');
  comm.playSong(id);
});

$(window).scroll(function() {
  if (!loading & more_songs) {

    if($(window).scrollTop() + $(window).height() > $(document).height()) {
      loading = true;
      setTimeout(function() {
        loading = false;
        $("#loading-spinner").removeClass("loading-spinner-visible");
      }, 1000);
      console.log("here");
      $("#loading-spinner").addClass("loading-spinner-visible");
      comm.socket.emit('load songs',{'genre':genre, num:comm.count});
    }
}
});

$("#filter_button").bind('click', function() {
  if ($('#g_complete').val() === '') {
    comm.socket.emit('populate songs', {'genre':'all'});
    genre = 'all';
  } else {
    genre = $('#g_complete').val();
    comm.socket.emit('populate songs', {'genre':genre});
    $('#g_complete').val('');
  }
  var menu = document.getElementById( 'bt-menu' );
  classie.remove( menu, 'bt-menu-open' );
  classie.add( menu, 'bt-menu-close' );

  jq.songsContainer.html('');
  comm.count = 0;
});

$("#submit_button").bind('click', function() {
console.log('submission');
  var song = {};
  song.name = $("#name").val();
  song.artist = $("#artist").val();
  song.url = $("#url").val();
  song.genre = $("#genre").val();
  comm.socket.emit('submit', song);
  var menu = document.getElementById( 'bt-menu' );
  classie.remove( menu, 'bt-menu-open' );
  classie.add( menu, 'bt-menu-close' );
  $("#bt-menu .bt-form").getNiceScroll().hide();
  $("#name").val('');
  $("#artist").val('');
  $("#url").val('');
  $("#genre").val('');
});
