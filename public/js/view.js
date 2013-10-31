var view = {};

view.display_entries = function(id, name, artist, genre, url, known) {
  var text = "<div class='entry' id='"+id+"'>" +
    "<span class='field'>\""+name+"\"</span>";
  if (known) {
    text += "<div class='controlcontainer'>" +
      "<i class='icon-play control play'></i>" +
      "<i class='icon-backward control rewind'></i>" +
      "</div><br>";
  }
  else {
    text += "<br>";
  }
  text += "<span class='field'>"+artist+"</span>";
  if (known) {
    text += "<div class='volumecontainer'><input id='test' type='text'>"+
      "</div><br>";
  }
  else {
    text += "<br>";
  }
  text += "<span class='field'>"+genre +"</span>"+
    "<a class='url' target='_blank' href='"+url+"'>source</a></div><br>";
  jq.songsContainer.append(text);
};

view.successful_song_submission = function() {
  $("#name").val('');
  $("#artist").val('');
  $("#url").val('');
  $("#genre").val('');
  $("#submit_message").removeClass('invalid').addClass('valid').text('submitted!');
};

view.unsuccessful_song_submission = function() {
  $("#submit_message").removeClass('valid').addClass('invalid');
  $("#submit_message").text(data.message);
};
