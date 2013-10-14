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

comm.parseurl = function(url) {
  if (url.indexOf("youtube.com") != -1) {
    return 1;
  }
  else if (url.indexOf("soundcloud.com") != -1) {
    return 2;
  }
  return 0;
}

comm.youtubeLinkParser = function(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return null;
  }
}

comm.createEntries = function(data) {
  var text = '';
  for (var i=0;i<data.length;i++) {
    if (!comm.entries[data[i]._id]) {
      var knownsite = comm.parseurl(data[i].url);
      text += "<div class='entry' id='" + data[i]._id + "'>" +
               "<span class='field'>\"" + data[i].name + "\"</span>";

      text += "<div class='controlcontainer'>" +
                "<i class='icon-play control play'></i>" +
                "<i class='icon-step-backward control rewind'></i>" +
              "</div>" +
              "<br>";

      text += "<span class='field'>" + data[i].artist + "</span><br>" +
              "<span class='field'>" + data[i].genre +  "</span></div><br>";

      if (knownsite === 1) {
        $('#mediacontainer').append("<div class='mediaplayer' id='yt" + data[i]._id + "'></div>");
      }
      else if (knownsite === 2) {
        $('#mediacontainer').append("<div class='mediaplayer' id='scd" + data[i]._id + "'></div>");
      }

      var entry = {};
      entry.name = data[i].name;
      entry.artist = data[i].artist;
      entry.knownsite = knownsite;
      entry.url = data[i].url;
      entry.playing = false;
      entry.mediastarted = false;
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

comm.setupYT = function(url, id) {
  var videoId = comm.youtubeLinkParser(url);
  if (videoId != null) {
    comm.entries[id].player = new YT.Player('yt'+id, {
      height: $('.entry').height() * .95,
      width: 200,
      videoId: videoId,
      events: {
        'onReady': onPlayerReady
      }
    });
  }
};

comm.setupSC = function(url, id) {
  var divId = 'scd' + id;
  var div = document.getElementById(divId);
  $(div).append("<iframe class='scplayer' id='scp"+
    id+"' src='http://w.soundcloud.com/player/?url="+
    url+"&show_artwork=false&liking=false&sharing=false"+
    "&auto_play=true' frameborder='no'></iframe>");
  var playerId = 'scp' + id;
  comm.entries[id].player = SC.Widget(playerId);
}

comm.playSong = function(id) {
  var entry = comm.entries[id];
  if (comm.playing_id != undefined) { // song playing, stop it
    comm.pauseSong(comm.playing_id);
  }
  if (!entry.mediastarted) {

    var url = entry.url;

    if (entry.knownsite === 1) {
      comm.setupYT(url, id);
    }
    else if (entry.knownsite === 2) {
      comm.setupSC(url, id);
    }
    else {
      console.log('not set up yet');
    }
    comm.entries[id].mediastarted = true;
    if (localStorage.getItem(id) == undefined) {
      localStorage.setItem(id, true);
      comm.socket.emit('add listen',{'_id':id});
    }
  }
  else {
    if (entry.knownsite === 1) {
      comm.entries[id].player.playVideo();
    }
    else if (entry.knownsite === 2) {
      comm.entries[id].player.play();
    }
    else {
      console.log("being set up");
    }
  }
  comm.playing_id = id;
  $("#" + id + " .play").removeClass("icon-play").removeClass("play")
         .addClass("icon-pause").addClass("pause");
  comm.entries[id].playing = true;
}

comm.pauseSong = function(id) {
  var entry = comm.entries[id];
  if (entry.mediastarted && entry.playing) {
    $("#" + id + " .pause").removeClass("icon-pause").removeClass("pause")
           .addClass("icon-play").addClass("play");
    if (entry.knownsite === 1) {
      comm.entries[id].player.pauseVideo();
      comm.entries[id].playing = false;
    }
    else if (entry.knownsite === 2) {
      comm.entries[id].player.pause();
      comm.entries[id].playing = false;
    }
    else {
      console.log("still being set up");
    }
    comm.playing_id = undefined;
  }
}

comm.rewindSong = function(id) {
  var entry = comm.entries[id];
  if (entry.mediastarted) {
    if (entry.knownsite === 1) {
      comm.entries[id].player.seekTo(0, false);
    }
    else if (entry.knownsite === 2) {
      comm.entries[id].player.seekTo(0);
    }
    else {
      console.log("still being set up");
    }
  }
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
