// config for requirejs
require.config({
  paths: {
    'jquery': 'js/lib/jquery/jquery-1.8.2.min',
    'jquery.ui': 'js/lib/jquery/jquery-1.8.2.min',
    'jquery.scrollto': 'js/lib/jquery/jquery.scrollTo.min',
    'underscore': 'js/lib/underscore/underscore',
    'knockout': 'js/lib/knockout/knockout-2.1.0',
    'text': 'js/lib/require/text',
    'scm': 'js/scm',
    'song': 'js/song',
    'scm.ui': 'js/scm.ui',
    'binding/slider': 'js/binding/slider',
    'binding/scm': 'js/binding/scm',
    'lib/knockout/pauseable': 'js/lib/knockout/pauseable',
    'classie': 'js/classie',
    'borderMenu': 'js/borderMenu',
    'nicescroll': 'js/jquery.nicescroll',
    'domready': 'lib/require/domready',
    'socket.io':'/socket.io/socket.io.js',
    'spin': 'js/spin',
    'comm': 'js/comm',
    'songmanager': 'js/songmanager',
    'view': 'js/view'
  },
  shim: {
    'underscore': {exports: '_'},
    'jquery.ui': {deps: ['jquery'],exports: 'jQuery'},
    'jquery.scrollto': {deps: ['jquery'],exports: 'jQuery'}
  }
});

require(['borderMenu', 'spin', 'classie', 'songmanager', 'comm', 'view', 'nicescroll'], function(menu, Spinner, classie, songmanager, comm, view){
  $('#bt-menu .bt-form').niceScroll({scrollspeed:200, bouncescroll:true, horizrailenabled:false, cursoropacitymax:0});
  $('#bt-menu .bt-form').getNiceScroll().hide;
  menu.init();
  comm.init(songmanager);
  var opts = {lines: 13, length: 7, width: 3, radius: 8, corners: 1, rotate: 0, 
              direction: 1, color: '#000', speed: 1, trail: 60, shadow: false, hwaccel: false, 
              className: 'spinner', zIndex: 2e9, top: 'auto',  left: 'auto'},
      target = document.getElementById('loading-spinner'),
      spinner = new Spinner(opts).spin(target);
  classie.addClass(target, "loading-spinner-visible");

  // event handlers
  $(document).on('click', '.listen', function() {
    console.log("listen")
    var id = $(this).parent().parent().attr('id');
    songmanager.playSong(id);
  });

  $("#filter_button").click(function() {
    songmanager.filter();
  });
  $("#submit_button").click(function() {
    songmanager.submitSong();
    console.log('submit');
  });
  $(window).scroll(function() {
    songmanager.infiniteScroll();
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
  $(document).on('click', '.bt-field > input', function() {
    var $input = $(this);
    $input.removeClass('untouched');
    $input.val('');
  });

  $(document).on('focusout', '.bt-field > input', function() {
    var $input = $(this);
    if ($input.val() === "") {
      $input.addClass("untouched");
      var text = $input.attr('id');
      if (text === "g_complete") {
        text = "genre";
      }
      else if (text === "name") {
        text = "title";
      }
      $input.val(text);
    }
  });
});

var availableTags = 
      ["Alternative","Dance","Electronic","Rap/Hip Hop","Pop","Jazz","Reggae","Folk",
       "Rock","Noise","Trap","Groovy","Funk","Nu Disco","House","Future Garage","Experimental"];

// $( "#g_complete" ).autocomplete({
//   source: availableTags
// });
// $( "#genre" ).autocomplete({
//   source: availableTags
// });