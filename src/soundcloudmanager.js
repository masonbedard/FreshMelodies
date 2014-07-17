(function(window, soundManager) {

'use strict';

var soundcloudManager = Object.create(soundManager);

soundcloudManager.createSound = function(options) {
  var url = options.url,
      sound, 
      consumer_key = "89e7642d86f9241b0d1917ebfae99e38",
      resolveURL,
      streamURL;

  if (options.url) {
    delete options.url;
  }

  sound = soundManager.createSound(options);

  resolveURL = 'http://api.soundcloud.com/resolve?url=' + url + '&format=json&consumer_key=' + consumer_key + '&callback=?';
  console.log(url);
  console.log(resolveURL);
  $.getJSON(resolveURL, function(data) {
    streamURL = data.stream_url;
    streamURL = (streamURL.indexOf("secret_token") === -1) ? streamURL + '?' : streamURL + '&';
    streamURL += 'consumer_key=' + consumer_key;

    sound.url = streamURL;
  });

  return sound;
};

soundcloudManager.canPlayURL = function(url) {
  return url.match('soundcloud');
};

window.soundcloudManager = soundcloudManager;

})(window, soundManager);
