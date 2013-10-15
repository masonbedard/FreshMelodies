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
      console.log('yt'+this.id);
      console.log(this.videoId);
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
    }
  };
  YTPlayer.prototype.pause = function () {
    if (this.player) {
      this.player.pauseVideo();
    }
  };
  YTPlayer.prototype.rewind = function () {
    if (this.player) {
      this.player.seekTo(0, false);
    }
  };
  window.YTPlayer = YTPlayer;

  function SCDPlayer (id, url) {
    this.url = url;
    this.id = id;
    this.ready = false;
  }
  SCDPlayer.prototype.setup = function() {
    var divId = 'scd' + this.id;
    var div = document.getElementById(divId);
    $(div).append("<iframe class='scplayer' id='scp"+
      this.id+"' src='http://w.soundcloud.com/player/?url="+
      this.url+"&show_artwork=false&liking=false&sharing=false"+
      "&auto_play=false' frameborder='no'></iframe>");
    var playerId = 'scp' + id;
    this.player = SC.Widget(playerId);
  }
  SCDPlayer.prototype.play = function () {
    if (!ready) {
      this.setup();
      this.ready = true;
    }
    this.player.play();
  }
  SCDPlayer.prototype.pause = function () {
    if (this.player) {
      this.player.pause();
    }
  }
  SCDPlayer.prototype.rewind = function () {
    if (this.player) {
      this.player.seekTo(0);
    }
  }
  window.SCDPlayer = SCDPlayer;

  function NullPlayer () {
    console.log("No player available for content.")
  }
  NullPlayer.prototype.play = function () {
    console.log("No player available for content.")
  }
  NullPlayer.prototype.pause = function () {
    console.log("No player available for content.")
  }
  NullPlayer.prototype.rewind = function () {
    console.log("No player available for content.")
  }
  window.NullPlayer = NullPlayer;

  window.CreatePlayer = function(url, id) {
    if (url.indexOf("youtube.com") != -1) {
      return new YTPlayer(url,id);
    }
    else if (url.indexOf("soundcloud.com") != -1) {
      return new SCDPlayer(url,id);
    }
    return new NullPlayer();
  }
}());