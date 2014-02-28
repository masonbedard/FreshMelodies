var view = {};
view.entryTemplate = $(document.getElementById("entryTemplate"));

view.display_entries = function(id, name, artist, genre, url, unknownSource) {
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
    jq.songsContainer.append(newEntry);
    jq.songsContainer.append(document.createElement("br"));
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
