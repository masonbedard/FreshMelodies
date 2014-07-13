/*
  youtubeManager
  2013 (c) Andrey Popp <8mayday@gmail.com>
*/

var YoutubeSound, youtubeManager;

YoutubeSound = (function() {
  var extractIdRe;

  extractIdRe = /v=([^&]+)/;

  function YoutubeSound(options) {
    var videoId,
      _this = this;

    this.options = options;

    this.pollingInterval = options.pollingInterval;
    this.whileplaying = options.whileplaying;
    this.onplay = options.onplay;
    this.onresume = options.onresume;
    this.onpause = options.onplay;
    this.onfinish = options.onfinish;
    this.buffered = void 0;
    this.bytesLoaded = void 0;
    this.isBuffering = void 0;
    this.connected = void 0;
    this.duration = void 0;
    this.durationEstimate = void 0;
    this.isHTML5 = false;
    this.loaded = false;
    this.muted = false;
    this.paused = false;
    this.playState = void 0;
    this.position = 0;
    this.readyState = 0;
    this._autoPlay = options.autoPlay;
    this._poller = void 0;
    this._previousState = void 0;
    videoId = options.youtubeVideoId || extractIdRe.exec(options.url)[1];
    if (videoId == null) {
      throw new Error("cannot extract videoId from URL: " + options.url);
    }
    this.player = new YT.Player('player', {
      height: 100,
      width: 100,
      videoId: videoId,
      events: {
        onReady: function() {
          return _this.onReady();
        },
        onStateChange: function() {
          return _this.onStateChange();
        }
      },
      playerVars: {
        controls: '0',
        enablejsapi: '1',
        modestbranding: '1',
        showinfo: '0',
      }
    });
  }

  YoutubeSound.prototype.onReady = function() {
    this.duration = this.durationEstimate = this.player.getDuration() * 1000;
    if (this._autoPlay) {
      return this.play();
    }
  };

  YoutubeSound.prototype.onStateChange = function() {
    var state;

    state = this.player.getPlayerState();
    if (state === -1) {
      this.duration = this.durationEstimate = this.player.getDuration() * 1000;
      this.loaded = true;
    }
    if (state === YT.PlayerState.PLAYING) {
      this.duration = this.durationEstimate = this.player.getDuration() * 1000;
      this._startPoller();
      this.paused = false;
      if (this.onplay) {
        this.onplay();
      }
      if (this.onresume && this._previousState === YT.PlayerState.PAUSED) {
        this.onresume();
      }
    } else if (state === YT.PlayerState.PAUSED) {
      this._stopPoller();
      this.paused = true;
      if (this.onpause) {
        this.onpause();
      }
    } else if (state === YT.PlayerState.ENDED) {
      this.paused = false;
      this._stopPoller();
      if (this.onfinish) {
        this.onfinish();
      }
    }
    return this._previousState = state;
  };

  YoutubeSound.prototype._startPoller = function() {
    var _this = this;

    return this._poller = setInterval((function() {
      return _this._updateState();
    }), this.pollingInterval || 100);
  };

  YoutubeSound.prototype._stopPoller = function() {
    if (!this._poller) {
      return;
    }
    clearInterval(this._poller);
    return this._poller = void 0;
  };

  YoutubeSound.prototype._updateState = function() {
    this.position = this.player.getCurrentTime() * 1000;
    if (this.whileplaying) {
      return this.whileplaying();
    }
  };

  YoutubeSound.prototype.destruct = function() {
    return this.player.destroy();
  };

  YoutubeSound.prototype.load = function() {};

  YoutubeSound.prototype.clearOnPosition = function() {};

  YoutubeSound.prototype.onPosition = function() {};

  YoutubeSound.prototype.mute = function() {
    this.muted = true;
    return this.player.mute();
  };

  YoutubeSound.prototype.pause = function() {
    if (this.player.pauseVideo != null) {
      return this.player.pauseVideo();
    } else {
      return this._autoPlay = false;
    }
  };

  YoutubeSound.prototype.play = function() {
    if (this.player.playVideo != null) {
      return this.player.playVideo();
    } else {
      return this._autoPlay = true;
    }
  };

  YoutubeSound.prototype.resume = function() {
    return this.play();
  };

  YoutubeSound.prototype.setPan = function() {};

  YoutubeSound.prototype.setPosition = function(ms) {
    return this.player.seekTo(ms / 1000);
  };

  YoutubeSound.prototype.setVolume = function(v) {
    return this.player.setVolume(v);
  };

  YoutubeSound.prototype.stop = function() {
    if (this.player.stopVideo != null) {
      this.player.seekTo(0);
      this.player.stopVideo();
      return this.position = 0;
    } else {
      return this._autoPlay = false;
    }
  };

  YoutubeSound.prototype.toggleMute = function() {
    if (this.player.isMuted()) {
      return this.unmute();
    } else {
      return this.mute();
    }
  };

  YoutubeSound.prototype.togglePause = function() {
    if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
      return this.pause();
    } else {
      return this.play();
    }
  };

  YoutubeSound.prototype.unload = function() {};

  YoutubeSound.prototype.unmute = function() {
    this.muted = false;
    return this.player.unMute();
  };

  return YoutubeSound;

})();

youtubeManager = {
  createSound: function(options) {
    return new YoutubeSound(options);
  },
  setup: function(options) {
    var oldCallback;

    if (options == null) {
      options = {};
    }
    if (window.onYouTubeIframeAPIReady != null) {
      oldCallback = window.onYouTubeIframeAPIReady;
    }
    window.onYouTubeIframeAPIReady = function() {
      if (options.onready) {
        options.onready();
      }
      if (oldCallback) {
        return oldCallback();
      }
    };
    this._injectScript();
    this._injectPlayerDiv();
  },
  _injectScript: function() {
    var firstScriptTag, tag;

    tag = document.createElement('script');
    if (window.location.host === 'localhost') {
      tag.src = 'http://www.youtube.com/player_api';
    } else {
      tag.src = '//www.youtube.com/player_api';
    }
    firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },
  _injectPlayerDiv: function() {
    var playerDiv, body;

    playerDiv = document.createElement('div');
    playerDiv.id = 'player';
    playerDiv.style.display='none';

    body = document.getElementsByTagName('body')[0];
    body.appendChild(playerDiv);
  }
};

if ((typeof define !== "undefined" && define !== null ? define.amd : void 0) != null) {
  define(youtubeManager);
}

if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = youtubeManager;
}
