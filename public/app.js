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
    'comm': 'js/comm'
  },
  shim: {
    'underscore': {exports: '_'},
    'jquery.ui': {deps: ['jquery'],exports: 'jQuery'},
    'jquery.scrollto': {deps: ['jquery'],exports: 'jQuery'}
  }
});

require(['borderMenu', 'spin', 'classie', 'nicescroll', 'socket.io', 'comm'], function(menu, Spinner, classie){
  $('#bt-menu .bt-form').niceScroll({scrollspeed:200, bouncescroll:true, horizrailenabled:false, cursoropacitymax:0});
  $('#bt-menu .bt-form').getNiceScroll().hide;

  menu.init();

  var opts = {lines: 13, length: 7, width: 3, radius: 8, corners: 1, rotate: 0, 
              direction: 1, color: '#000', speed: 1, trail: 60, shadow: false, hwaccel: false, 
              className: 'spinner', zIndex: 2e9, top: 'auto',  left: 'auto'},
      target = document.getElementById('loading-spinner'),
      spinner = new Spinner(opts).spin(target);
  classie.addClass(target, "loading-spinner-visible");

  // event handlers
  $(".listen").click(function() {
    var id = $(this).parent().parent().parent().attr('id');
    model.playSong(id);
  });
  $("#filter_button").click(function() {
    model.filter();
  });
  $("#submit_button").click(function() {
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
});

soundManager.preferFlash = false;
soundManager.useHTML5Audio = true;
soundManager.url = 'swf/';
soundManager.allowScriptAccess = 'always';