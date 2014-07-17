'use strict';

module.exports = function(grunt) {
  var files = ['src/bordermenu.js','src/spin.js','src/youtubemanager.js', 'src/soundcloudmanager.js',  'src/fmplayer.js', 'src/app.js'];

  grunt.initConfig({
    banner: '/* FM <%= grunt.template.today("yyyy-mm-dd") %>*/\n',
    // Task configuration.
    clean: {
      src: ['public/js/', 'logs/*']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        jquery: true,
        devel: true
      },
      files: files
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: files,
        dest: 'public/js/fm.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'public/js/fm.min.js'
      },
    },
    copy: {
      bowerfiles: {
        files: [
          {src: 'bower_components/angular/angular.min.js', dest: 'public/js/angular.min.js'},
          {src: 'bower_components/angular-animate/angular-animate.min.js', dest: 'public/js/angular-animate.min.js'},
          {src: 'bower_components/jquery/dist/jquery.min.js', dest: 'public/js/jquery.min.js'},
          {src: 'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js', dest: 'public/js/ng-infinite-scroll.min.js'},
          {src: 'bower_components/soundmanager2/script/soundmanager2-jsmin.js', dest: 'public/js/soundmanager2-jsmin.js'}
        ]
      }
    },
    exec: {
      bower_install: {
        command: 'bower install'
      },
      npm_install: {
        command: 'npm install'
      },
      server: {
        command: 'node server/server.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('install', ['exec:npm_install', 'exec:bower_install']);

  grunt.registerTask('server', ['exec:server']);

  // Default task.
  grunt.registerTask('default', ['install', 'clean', 'copy', 'jshint', 'concat', 'uglify', 'server']);

};