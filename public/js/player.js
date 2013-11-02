(function () {
  var youtubeLinkParser = function(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return null;
    }
  }
  function YTPlayer (id, url) {
      this.url = url;
      this.videoId = youtubeLinkParser(url);
      this.player = null;
      this.id = id;
      this.ready = false;
  };
  YTPlayer.prototype.getInfo = function () {
      return this.color + ' ' + this.type + ' apple';
  };
  YTPlayer.prototype.setup = function () {
    if (this.videoId != null) {
      $('#mediacontainer').append("<div class='mediaplayer' id='yt" + this.id + "'></div>");
      this.player = new YT.Player('yt'+this.id, {
        height: $('.entry').height() * .95,
        width: 200,
        videoId: this.videoId,
        events: {
          'onReady': onPlayerReady
        }
      });
    }
  };
  YTPlayer.prototype.play = function () {
    if (!this.ready) {
      this.setup();
      this.ready = true;
    } else {
      this.player.playVideo();
      model.calculate_progress();
    }
  };
  YTPlayer.prototype.pause = function () {
    if (this.player) {
      this.player.pauseVideo();
    }
  };
  YTPlayer.prototype.setVolume = function (volume) {
    if (this.player) {
        this.player.setVolume(volume);
    }
  };
  YTPlayer.prototype.seekTo = function(seconds) {
    if (this.player) {
        this.player.seekTo(seconds, true);
    }
  };
  window.YTPlayer = YTPlayer;

  function SCDPlayer (id, url) {
    this.url = url;
    this.id = id;
    this.ready = false;
  }
  SCDPlayer.prototype.setup = function() {
    $('#mediacontainer').append("<div class='mediaplayer' id='scd" + this.id + "'></div>");
    var divId = 'scd' + this.id;
    var div = document.getElementById(divId);
    $(div).append("<iframe class='scplayer' id='scp"+
      this.id+"' src='http://w.soundcloud.com/player/?url="+
      this.url+"&show_artwork=false&liking=false&sharing=false"+
      "frameborder='no'></iframe>");
    var playerId = 'scp' + this.id;
    this.player = SC.Widget(playerId);
    var this_player = this.player;
    this_player.bind(SC.Widget.Events.READY, function() {
      //this_player.seekTo(model.progress_value_to_seconds(model.entries[model.playing_id].progress_value) * 1000);
      //this_player.setVolume(model.entries[model.playing_id].curr_volume);
      this_player.play();

      model.calculate_progress();
    });
  };
  SCDPlayer.prototype.play = function () {
    if (!this.ready) {
      this.setup();
      this.ready = true;
      console.log('ready');
    }
    else {
        console.log('nope');
      this.player.play();
      model.calculate_progress();
    }
    console.log('done');
  };
  SCDPlayer.prototype.pause = function () {
    if (this.player) {
      this.player.pause();
    }
  };
  SCDPlayer.prototype.setVolume = function (volume) {
      console.log('volume settting');
    if (this.player) {
      this.player.setVolume(volume);
    }
  };
  SCDPlayer.prototype.seekTo = function (seconds) {
    if (this.player) {
      this.player.seekTo(seconds * 1000);
    }
  };

  window.SCDPlayer = SCDPlayer;

  function NullPlayer () {
    console.log("No player available for content.");
  }
  NullPlayer.prototype.play = function () {
    console.log("No player available for content.");
  };
  NullPlayer.prototype.pause = function () {
    console.log("No player available for content.");
  };
  NullPlayer.prototype.setVolume = function (volume) {
    console.log("No player available for content.");
  };
  NullPlayer.prototype.seekTo = function (seconds) {
    console.log("No player available for content.");
  }
  window.NullPlayer = NullPlayer;

  window.CreatePlayer = function(id, url) {
    if (url.indexOf("youtube.com") != -1) {
      return new YTPlayer(id,url);
    }
    else if (url.indexOf("soundcloud.com") != -1) {
      return new SCDPlayer(id,url);
    }
    return new NullPlayer();
  };
}());
