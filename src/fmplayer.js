(function(window, youtubeManager, soundcloudManager, soundManager) {

'use strict';

function FMPlayer() {
  var _this = this;

  this.entries = [];
  this.sounds = [];
  this.inited = false;
  this.currentSound = null;
  this.playerClass = 'fmplayer';
  this.playerLoadedClass = 'fmloaded';
  this.playerUrlTag = 'fmurl';
  this.progressDivClass = 'progress';
  this.soundManagers = [youtubeManager, soundcloudManager, soundManager];

  this.events = {
    onstart: function() {
      var currEntryIndex = _this.sounds.indexOf(this);
      var currEntry = _this.entries[currEntryIndex];
      var progress = $(currEntry).children('.'+_this.progressDivClass);
      progress.css('width', '0%');
    },
    onstop: function() {
      var currEntryIndex = _this.sounds.indexOf(this);
      var currEntry = _this.entries[currEntryIndex];
      var progress = $(currEntry).children('.'+_this.progressDivClass);
      progress.css('width', '0%');
    },
    onfinish: function() {
      var currEntryIndex = _this.sounds.indexOf(this);
      var currEntry = _this.entries[currEntryIndex];
      var progress = $(currEntry).children('.'+_this.progressDivClass);
      progress.css('width', '0%');
    },
    whileplaying: function() {
      var currEntryIndex = _this.sounds.indexOf(this);
      var currEntry = _this.entries[currEntryIndex];
      var progress = $(currEntry).children('.'+_this.progressDivClass);
      progress.css('width', this.position/this.durationEstimate*100 + '%');
    }
  };

  this.clickHandler = function(e) {
    var currEntryIndex = _this.entries.indexOf(e.target);
    var sound = _this.sounds[currEntryIndex];

    if (!_this.currentSound) { // no previous song
      _this.currentSound = sound;
      sound.play();
    } else if (_this.currentSound === sound) {
      _this.currentSound.togglePause();
    } else {
      _this.currentSound.stop();
      _this.currentSound = sound;
      sound.play();
    }
  };

  this.init = function() {
    var newEntries = $('.'+_this.playerClass).not('.'+_this.playerLoadedClass);

    for (var i = 0; i < newEntries.length; i++) {
      _this.entries.push(newEntries[i]);

      $(newEntries[i]).addClass(_this.playerLoadedClass);
      $(newEntries[i]).click(_this.clickHandler);

      var entryUrl = $(newEntries[i]).attr(_this.playerUrlTag);
      var entryId = $(newEntries[i]).attr('id');
      var entrySound = null;
      for (var j = 0; j < _this.soundManagers.length; j++) {
        if (_this.soundManagers[j].canPlayURL(entryUrl)) {
          entrySound = _this.soundManagers[j].createSound({
            url: entryUrl,
            id: entryId,
            onstart: _this.events.onstart,
            onstop: _this.events.onstop,
            onfinish: _this.events.onfinish,
            whileplaying: _this.events.whileplaying
          });
          break;
        }
      }
      _this.sounds.push(entrySound);
    }

    _this.inited = true;
  };
}

window.FMPlayer = FMPlayer;
window.fmplayer = new FMPlayer();

})(window, youtubeManager, soundcloudManager, soundManager);