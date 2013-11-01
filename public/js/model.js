var model = {};

model.loading = true;
model.genre = 'all';
model.more_songs = true;
model.curr_volume = 0;
model.progress_clicked = false;

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

model.progress_value_to_seconds = function(progress_value) {
  return progress_value * model.entries[model.playing_id].duration / .91;
};

model.calculate_progress = function(duration) {
  model.entries[model.playing_id].duration = duration;
  var num_of_ticks_bar_must_represent = duration * 2;
  model.entries[model.playing_id].value_per_tick = .91 / num_of_ticks_bar_must_represent;
  //model.entries[model.playing_id].value_per_tick = .91/duration;
  model.track_progress();
};

model.track_progress = function() {
  setTimeout(function() {
      if (model.playing_id) {
          if (!model.progress_clicked) {
            var id = model.playing_id;
            model.entries[id].progress_value += model.entries[id].value_per_tick;
            $('#'+id+" .controlcontainer .progresscontainer input").simpleSlider("setValue", model.entries[id].progress_value);
          }
          model.track_progress();
      }
  },500);
};

model.enableSliders = function(id) {
  $('#'+id+' .controlcontainer .progresscontainer input').simpleSlider();
  $('#'+id+' .controlcontainer .progresscontainer .slider').css('width', '200');
  $('#'+id+' .controlcontainer .progresscontainer input').bind("slider:changed", function(event, data) {
    var clickedId = $(this).parent().parent().parent().attr('id');
    model.entries[clickedId].progress_value = data.value;
    if (model.progress_clicked && model.playing_id === clickedId) {
        var seconds = model.progress_value_to_seconds(model.entries[clickedId].progress_value);
        model.seekTo(id, seconds);
    }
  });

  $('#'+id+' .volumecontainer input').simpleSlider();
  $('#'+id+' .volumecontainer input').simpleSlider('setValue', '.82');
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
      entry.progress_value = 0;
      entry.duration = 0;
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
    view.unsuccessful_song_submission(data);
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
  model.playing_id = id;
  model.entries[id].playing = true;
  model.entries[id].player.play();
  $("#" + id + " .play").removeClass("icon-play").removeClass("play")
    .addClass("icon-pause").addClass("pause");
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

model.seekTo = function(id, seconds) {
  var entry = model.entries[id];
  entry.player.seekTo(seconds);
};


