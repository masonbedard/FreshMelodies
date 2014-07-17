(function(angular, io, fmplayer) {

'use strict';

var fm = angular.module('freshmelodies', ['ngAnimate', 'infinite-scroll']);

fm.factory('$socket', ['$rootScope', function ($rootScope) {
  var $socket = io.connect();
  return {
    on: function (eventName, callback, afterApplyCallback) {
      $socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply($socket, args);
        });
        if (typeof afterApplyCallback === 'function') {
          afterApplyCallback.apply();
        }
      });
    },
    emit: function (eventName, data, callback) {
      $socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply($socket, args);
          }
        });
      });
    }
  };
}]);

fm.controller('SubmitCtrl', ['$scope', '$socket', function($scope, $socket) {
  $scope.resetInputFields = function() {
    $scope.nameIn = "";
    $scope.artistIn = "";
    $scope.genreIn = "";
    $scope.urlIn = "";
  };

  var emitSubmitSongData = function(songData) {
    $socket.emit("submit", songData);
    $scope.resetInputFields();
  };

  $scope.submitSong = function() {
    var songData = {
      name: $scope.nameIn,
      artist: $scope.artistIn,
      genre: $scope.genreIn,
      url: $scope.urlIn
    };

    emitSubmitSongData(songData);
  };
}]);

fm.controller('SongCtrl', ['$scope', '$socket', function($scope, $socket) {
  $scope.songs = [];
  $scope.moreSongsAvailable = true;

  $socket.on('songs', function(data) {
    $scope.songs = data;

    setTimeout(function() {
      $(window.spinner).removeClass('loading-spinner-visible');
      $('#songContainer').removeClass('hidden');
    }, 500);
  }, fmplayer.init);

  $socket.on('newSong', function(data) {
    $scope.songs.unshift(data);
  }, fmplayer.init);

  $socket.on('deleteSong', function(data) {
    for (var i = 0; i < $scope.songs.length; i++) {
      if ($scope.songs[i]._id === data._id) {
        $scope.songs.splice(i, 1);
        break;
      }
    }
  });

  $socket.on('moreSongs', function(data) {
    if (data.length > 0) {
      $scope.songs = $scope.songs.concat(data);
    } else {
      $scope.moreSongsAvailable = false;
    }
    $(window.spinner).removeClass('loading-spinner-visible');
  }, fmplayer.init);

  $scope.loadMoreSongs = function() {
    if ($scope.moreSongsAvailable) {
      var data = $scope.songs[$scope.songs.length-1];
      $socket.emit('loadMoreSongs', data);
      $(window.spinner).addClass('loading-spinner-visible');
    }
  };
}]);

})(angular, io, fmplayer);