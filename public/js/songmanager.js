define(['socket.io', 'jquery', 'borderMenu', 'comm', 'view'], function(io, $, menu, comm, view) {
  var songs = {},
      loading = true,
      more_songs = true,
      genre = 'all';

  var addListen = function(id) {
    if (localStorage.getItem(id) == undefined) {
      localStorage.setItem(id, true);
      comm.addListen(id)
    }
  };

  var isInvalidURL = function(url) {
    var result = true;
    if (url.indexOf("youtube.com") != -1) {
        result = false;
    }
    if (url.indexOf("soundcloud.com") != -1) {
        result = false;
    }
    return result;
  };

  var createEntries = function(data) {
    for (var i=0;i<data.length;i++) {
      if (!songs[data[i]._id]) {

        var unknownSource = isInvalidURL(data[i].url); 
        view.displayEntry(data[i]._id, data[i].name, data[i].artist, data[i].genre, data[i].url, unknownSource);
        var entry = {};
        entry.name = data[i].name;
        entry.artist = data[i].artist;
        entry.url = data[i].url;

        songs[data[i]._id] = entry;
      }
    }
    loading = false;
    $("#loading-spinner").removeClass("loading-spinner-visible");
  };

  var submitSong = function() {
    var song = {};
    // MAKE THESE NOT IDS
    song.name = $("#name").val();
    song.artist = $("#artist").val();
    song.url = $("#url").val();
    song.genre = $("#genre").val();
    if (song.name === undefined || song.name === "") {
      $("#submit_message").removeClass('valid').addClass('invalid').text('invalid song name');
    } else if (song.artist === undefined || song.artist === "") {
      $("#submit_message").removeClass('valid').addClass('invalid').text('invalid artist');
    } else if (song.genre === undefined || song.genre === '') {
      $("#submit_message").removeClass('valid').addClass('invalid').text('invalid genre');
    } else if (song.url === undefined || song.url === "") {
      $("#submit_message").removeClass('valid').addClass('invalid').text('invalid url');
    } else {
      comm.submitSong(song);
    }
  };

  var infiniteScroll = function() {
    if (!loading && more_songs) {
      if($(window).scrollTop() + $(window).height() > $(document).height()) {
        model.loading = true;
        setTimeout(function() {
          model.loading = false;
          $("#loading-spinner").removeClass("loading-spinner-visible");
        }, 1000);
        $("#loading-spinner").addClass("loading-spinner-visible");
        io.emit('load songs',{'genre':model.genre, num:model.num});
      }
    }
  };

  var reset = function() {
    loading = true;
    more_songs = true;
    model.entries = {};
    $('#songsContainer').empty();
    songs = {};
  };

  var filter = function() {
    model.reset_data();
    if ($('#g_complete').val() === '') {
      model.genre = 'all';
    } else {
      model.genre = $('#g_complete').val();
      $('#g_complete').val('');
    }
    menu.closeMenu();
    $("#submit_message").text('');
    $("#loading-spinner").addClass("loading-spinner-visible");
    comm.loadSongs(model.genre, 20);
  };

  var playSong = function(id) {
    var song = songs[id];

    SCM.play({title:song.name, url:song.url});
    addListen(id);
  }

  return {
    addListen: addListen,
    isInvalidURL: isInvalidURL,
    createEntries: createEntries,
    submitSong: submitSong,
    infiniteScroll: infiniteScroll,
    reset: reset,
    filter: filter,
    playSong: playSong,
    more_songs: more_songs
  };
});
