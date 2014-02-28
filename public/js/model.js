var model = {};

model.songs = {};

model.loading = true;
model.more_songs = true;
model.genre = 'all';
model.num = 0;

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

model.createEntries = function(data) {
  for (var i=0;i<data.length;i++) {
    if (!model.songs[data[i]._id]) {

      var known = model.check_if_url_known(data[i].url); 
      view.display_entries(data[i]._id, data[i].name, data[i].artist, 
        data[i].genre, data[i].url, known);

      var entry = {};
      entry.name = data[i].name;
      entry.artist = data[i].artist;
      entry.url = data[i].url;
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
    $("#submit_message").removeClass('valid').addClass('invalid').text('invalid genre');
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

model.playSong = function(id) {
  var song = model.songs[id];

  SCM.play({title:song.name, url:song.url});
  model.check_if_listen_added(id);
};