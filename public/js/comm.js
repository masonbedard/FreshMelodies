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
      var known;
      if (data[i].url.indexOf("youtube.com") != -1 ||
        data[i].url.indexOf("soundcloud.com") != -1) {
        known = true;
      }
      else {
        known = false;
      }
      text += "<div class='entry' id='" + data[i]._id + "'>" +
               "<span class='field'>\"" + data[i].name + "\"</span>";
      if (known) {
          text += "<div class='controlcontainer'>" +
            "<i class='icon-play control play'></i>" +
            "<i class='icon-backward control rewind'></i>" +
            "</div><br>";
      }
      else {
        text += "<br>";
      }

      text += "<span class='field'>" + data[i].artist + "</span>";

      if (known) {
        text += "<div class='volumecontainer'><input id='test' type='text'>"+
          "</div><br>";
      }
      else {
        text += "<br>";
      }
      text += "<span class='field'>" + data[i].genre +  "</span>"+
          "<a class='url' target='_blank' href='"+data[i].url+"'>source</a></div><br>";

      jq.songsContainer.append(text);
      text = '';

      if (known) {
          $('#'+data[i]._id +' .volumecontainer input').simpleSlider();
          $('#'+data[i]._id +' .volumecontainer input').simpleSlider('setValue', '.61');

          $('#'+data[i]._id +' .volumecontainer input').bind("slider:changed", function (event, data) {
              console.log('setting volume to ' + data.value * 10000 / 82);
              var id = $(this).parent().parent().attr('id');
              comm.setVolume(id, data.value * 10000 / 82);
          });
      }

      var entry = {};
      entry.name = data[i].name;
      entry.artist = data[i].artist;
      entry.url = data[i].url;
      entry.player = CreatePlayer(data[i]._id, data[i].url);
      entry.playing = false;
      comm.entries[data[i]._id] = entry;
    }
  }
  //jq.songsContainer.append(text);
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

comm.setVolume = function(id, volume) {
  var entry = comm.entries[id];
  entry.player.setVolume(volume);
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
  if (localStorage.getItem(id) == undefined) {
    localStorage.setItem(id, true);
    comm.socket.emit('add listen',{'_id':id});
  }
});

jq.doc.on('click', 'a', function() {
    var id = $(this).parent().attr('id');
    console.log(id);
    if (localStorage.getItem(id) == undefined) {
      localStorage.setItem(id, true);
      comm.socket.emit('add listen',{'_id':id});
    }
    console.log("LINKED");
});

$(window).scroll(function() {
  if (!loading & more_songs) {

    if($(window).scrollTop() + $(window).height() > $(document).height()) {
      loading = true;
      setTimeout(function() {
        loading = false;
        $("#loading-spinner").removeClass("loading-spinner-visible");
      }, 1000);
      $("#loading-spinner").addClass("loading-spinner-visible");
      comm.socket.emit('load songs',{'genre':genre, num:comm.count});
    }
}
});

$("#filter_button").bind('click', function() {
  comm.count = 0;
  loading = true;
  more_songs = true;
  comm.count = 0;
  if (comm.playing_id != undefined) {
    comm.entries[comm.playing_id].player.pauseSong();
  }
  comm.playing_id  = undefined;
  comm.entries = {};
  if ($('#g_complete').val() === '') {
    genre = 'all';
  } else {
    genre = $('#g_complete').val();
    $('#g_complete').val('');
  }
  jq.songsContainer.empty();
  console.log('emit' + genre + comm.count);
  comm.socket.emit('load songs',{'genre':genre, num:0});
  var menu = document.getElementById( 'bt-menu' );
  classie.remove( menu, 'bt-menu-open' );
  classie.add( menu, 'bt-menu-close' );
  $("#bt-menu .bt-form").getNiceScroll().hide();
  $("#submit_message").text('');
  jq.songsContainer.html('');
  comm.count = 0;
  $("#loading-spinner").addClass("loading-spinner-visible");
});

$("#submit_button").bind('click', function() {
  var song = {};
  song.name = $("#name").val();
  song.artist = $("#artist").val();
  song.url = $("#url").val();
  song.genre = $("#genre").val();
  if (song.name === undefined || song.name === "") {
    $("#submit_message").removeClass('valid').addClass('invalid').text('invalid song name');
  } else if (song.artist === undefined || song.artist === "") {
    $("#submit_message").removeClass('valid').addClass('invalid').text('invalid artist');
  } else if (song.genre === undefined || availableTags.indexOf(song.genre) === -1) {
    $("#submit_message").removeClass('valid').addClass('invalid').text('select genre from list');
  } else if (song.url === undefined || song.url === "") {
    $("#submit_message").removeClass('valid').addClass('invalid').text('invalid url');
  } else {
    comm.socket.emit('submit', song);
  }
});

comm.socket.on("submit result", function(data) {
  if (data.result === true) {
    $("#name").val('');
    $("#artist").val('');
    $("#url").val('');
    $("#genre").val('');
    $("#submit_message").removeClass('invalid').addClass('valid').text('submitted!');
  } else {
    $("#submit_message").removeClass('valid').addClass('invalid');
    $("#submit_message").text(data.message);
  }

});

$("#g_complete").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("#filter_button").click();
    }
});
$("#url").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("#submit_button").click();
    }
});