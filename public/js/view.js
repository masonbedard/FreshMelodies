define(['jquery'], function($) {
  var view = {};
  view.entryTemplate = $(document.getElementById("entryTemplate"));

  view.displayEntry = function(id, name, artist, genre, url, unknownSource) {
    var newEntry = view.entryTemplate.clone().attr('id', id).css({display:'block'});
    var rows = newEntry.find("> div");

    var firstRow = $(rows[0]);
    firstRow.find("> span.fieldLeft").text(name);
    if (unknownSource) {
        firstRow.find("> span.fieldRight").text('');
    }

    var secondRow = $(rows[1]);
    secondRow.find("> span.fieldLeft").text(artist);

    var thirdRow = $(rows[2]);
    thirdRow.find("> span").text(genre);
    thirdRow.find("> a").attr("href", url);
    $('#songsContainer').append(newEntry);
    $('#songsContainer').append(document.createElement("br"));
  };

  view.successfulSongSubmission = function() {
    $("#name").val('');
    $("#artist").val('');
    $("#url").val('');
    $("#genre").val('');
    $("#submit_message").removeClass('invalid').addClass('valid').text('submitted!');
    console.log("success")
  };

  view.unsuccessfulSongSubmission = function(data) {
    $("#submit_message").removeClass('valid').addClass('invalid');
    $("#submit_message").text(data.message);
    console.log("fail")
  };
  return view;
});