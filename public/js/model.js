var model = {};

model.loading = true;
model.genre = 'all';
model.more_songs = true;
model.curr_volume = 0;

model.num = 0;
model.playing_id = undefined;

model.entries = {};

model.check_if_listen_added = function(id) {
  if (localStorage.getItem(id) == undefined) {
    localStorage.setItem(id, true);
    comm.socket.emit('add listen',{'_id':id});
  }
};

model.check_if_url_known = function(url) {
  if (url.indexOf("youtube.com") != -1) {
    return true;
  }
  else if (url.indexOf("soundcloud.com") != -1) {
    return true;
  }
  else {
    return false;
  }
};

model.enableSliders = function(id) {
  $('#'+id+' .volumecontainer input').simpleSlider();
  $('#'+id+' .volumecontainer input').simpleSlider('setValue', '.61');
  $('#'+id+' .volumecontainer input').bind("slider:changed", function (event, data) {
    var clickedId = $(this).parent().parent().attr('id');
    if (model.curr_volume != data.value * 10000 / 82) {
      model.curr_volume = data.value * 10000 / 82;
      model.setVolume(clickedId, data.value * 10000 / 82);
    }
  });
};

model.createEntries = function(data) {
  for (var i=0;i<data.length;i++) {
    if (!model.entries[data[i]._id]) {

      var known = model.check_if_url_known(data[i].url); 
      view.display_entries(data[i]._id, data[i].name, data[i].artist, 
        data[i].genre, data[i].url, known);
      if (known) {
        model.enableSliders(data[i]._id);
      }

      var entry = {};
      entry.name = data[i].name;
      entry.artist = data[i].artist;
      entry.url = data[i].url;
      entry.player = CreatePlayer(data[i]._id, data[i].url);
      entry.playing = false;
      model.entries[data[i]._id] = entry;
    }
  }
  model.num += data.length + 1;
  model.loading = false;
  $("#loading-spinner").removeClass("loading-spinner-visible");
};

model.submit_song = function() {
  var song = {};
  song.name = $("#name").val();
  song.artist = $("#artist").val();
  song.url = $("#url").val();
  song.genre = $("#genre").val();
  if (song.name === undefined || song.name === "") {
    $("#submit_message").removeClass('valid').addClass('invalid').text('invalid song name');
  } else if (song.artist === undefined || song.artist === "") {
    $("#submit_message").removeClass('valid').addClass('invalid').text('invalid artist');
  } else if (song.genre === undefined || song.genre === '') {
    $("#submit_message").removeClass('valid').addClass('invalid').text('invalid');
  } else if (song.url === undefined || song.url === "") {
    $("#submit_message").removeClass('valid').addClass('invalid').text('invalid url');
  } else {
    comm.socket.emit('submit', song);
  }
};

model.submission_results = function(data) {
  if (data.result === true) {
    view.successful_song_submission();
  } else {
    view.unsuccessful_song_submission();
  }
};

model.infinite_scroll = function() {
  if (!model.loading && model.more_songs) {
    if($(window).scrollTop() + $(window).height() > $(document).height()) {
      model.loading = true;
      setTimeout(function() {
        model.loading = false;
        $("#loading-spinner").removeClass("loading-spinner-visible");
      }, 1000);
      $("#loading-spinner").addClass("loading-spinner-visible");
      comm.socket.emit('load songs',{'genre':model.genre, num:model.num});
    }
  }
};

model.reset_data = function() {
  model.num = 0;
  model.loading = true;
  model.more_songs = true;
  if (model.playing_id != undefined) {
    model.entries[model.playing_id].player.pauseSong();
  }
  model.playing_id = undefined;
  model.entries = {};
};

model.filter = function() {
  model.reset_data();
  if ($('#g_complete').val() === '') {
    model.genre = 'all';
  } else {
    model.genre = $('#g_complete').val();
    $('#g_complete').val('');
  }
  jq.songsContainer.empty();
  var menu = document.getElementById('bt-menu');
  classie.remove( menu, 'bt-menu-open' );
  classie.add( menu, 'bt-menu-close' );
  $("#bt-menu .bt-form").getNiceScroll().hide();
  $("#submit_message").text('');
  $("#loading-spinner").addClass("loading-spinner-visible");
  comm.socket.emit('load songs',{'genre':model.genre, num:model.num});
};

model.setVolume = function(id, volume) {
  var entry = model.entries[id];
  entry.player.setVolume(volume);
};

model.playSong = function(id) {
  if (model.playing_id != undefined) { // song playing, stop it
    model.pauseSong(model.playing_id);
  }
  var entry = model.entries[id];
  entry.player.play();
  entry.playing = true;
  model.playing_id = id;
  $("#" + id + " .play").removeClass("icon-play").removeClass("play")
    .addClass("icon-pause").addClass("pause");
  model.entries[id].playing = true;
  model.check_if_listen_added(id);
};

model.pauseSong = function(id) {
  var entry = model.entries[id];
  if (entry.playing) {
    entry.player.pause();
    model.playing_id = undefined;
    $("#" + id + " .pause").removeClass("icon-pause").removeClass("pause")
      .addClass("icon-play").addClass("play");
    entry.playing = false;
  }
};

model.rewindSong = function(id) {
  var entry = model.entries[id];
  entry.player.rewind();
};

