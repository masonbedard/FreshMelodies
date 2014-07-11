var validYouTube = function(url) {
  return true;
};

var validSoundCloud = function(url) {
  return true;
};

var validExfm = function(url) {
  return true;
};

var validOther = function(url) {
  return false;
};

var urlregex = [
  {regex:"(youtube.com|youtu.be)", validator: validYouTube},
  {regex:"^http(s)?\:\/\/soundcloud.com", validator: validSoundCloud},
  {regex:"^( *)(http(s)?://)?(www.)?ex.fm", validator: validExfm},
  {regex:".*", validator: validOther}
];

var validate = function(url) {
  if (typeof(url) !== "string") {
    return false;
  }
  for (var i = 0; i < urlregex.length; i++) {
    if (url.match(urlregex[i].regex)) {
      return urlregex[i].validator(url);
    }
  }
}