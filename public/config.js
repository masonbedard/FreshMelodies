var requirejs = ({
  paths: {
    'jquery': 'lib/jquery/jquery-1.8.2.min',
    'jquery.ui': 'lib/jquery/jquery-ui.min',
    'jquery.scrollto': 'lib/jquery/jquery.scrollTo.min',
    'underscore': 'lib/underscore/underscore',
    'knockout': 'lib/knockout/knockout-2.1.0',
    'text': 'lib/require/text',
    'scm': 'scm',
    'song': 'song',
    'scm.ui': 'scm.ui',
    'binding/slider': 'binding/slider',
    'binding/scm': 'binding/scm',
    'lib/knockout/pauseable': 'lib/knockout/pauseable',
    'classie': 'classie',
    'borderMenu': 'borderMenu',
    'nicescroll': 'jquery.nicescroll',
    'domready': 'lib/require/domready',
    'socket.io':'/socket.io/socket.io.js',
    'spin': 'spin',
    'comm': 'comm',
    'songmanager': 'songmanager',
    'view': ''
  },
  shim: {
    'underscore': {exports: '_'},
    'jquery.ui': {deps: ['jquery'],exports: 'jQuery'},
    'jquery.scrollto': {deps: ['jquery'],exports: 'jQuery'}
  },
  baseUrl: 'js/',
  config: {
    'scm':{
      playback:{
        'youtube':'(youtube.com|youtu.be)',
        'soundcloud':'^http(s)?\:\/\/soundcloud.com',
        "exfm": "^( *)(http(s)?://)?(www.)?ex.fm",
        'soundmanager':'.*'
      },
      playlist:{
        'youtube':'(youtube.com|youtu.be)',
        'soundcloud':'^http(s)?\:\/\/soundcloud.com',
        'rss':'.*'
      }
    }
  }
});

soundManager.preferFlash = false;
soundManager.useHTML5Audio = true;
soundManager.url = 'swf/';
soundManager.allowScriptAccess = 'always';