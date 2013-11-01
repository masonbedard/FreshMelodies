jq.doc.on('click', '.pause', function() {
  var id = $(this).parent().parent().parent().attr('id');
  model.pauseSong(id);
});

jq.doc.on('click', '.rewind', function  () {
  var id = $(this).parent().parent().attr('id');
  model.rewindSong(id);
});

jq.doc.on('click', '.play', function() {
  var id = $(this).parent().parent().parent().attr('id');
  model.playSong(id);
});

jq.doc.on('click', 'a', function() {
    var id = $(this).parent().attr('id');
    model.check_if_listen_added(id);
});

jq.doc.on('click', '#filter_button', function() {
  model.filter();
});

jq.doc.on('mouseup', '.slider2', function() {
  model.progress_clicked = false;
  var id = $(this).parent().parent().parent().attr('id');
});
/*
jq.doc.on('mousedown', '.track', function() {
  console.log('mousedown');
});
*/


jq.doc.on('click', '#submit_button', function() {
  model.submit_song();
});

$(window).scroll(function() {
  model.infinite_scroll();
});

$("#g_complete").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("#filter_button").click();
    }
});

$("#url").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("#submit_button").click();
    }
});
