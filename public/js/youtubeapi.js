var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onPlayerReady(event) {
  var entry = model.entries[model.playing_id];
  entry.player.setVolume(entry.curr_volume);
  entry.player.seekTo(model.progress_value_to_seconds(entry.progress_value), true);
  entry.player.play();
  model.calculate_progress();
}
