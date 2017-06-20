'use strict';

module.exports = function(grunt) {

	var moduleName = 'ovh-angular-timeline';

	var beautifyFiles = ['!Gruntfile.js', '!npm-shrinkwrap.json', 'src/**/*.{html,js}', '!app/bower_components/**/*'];

	// Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    connect: {
             server: {
               options: {
                 port: 9000
               }
             }
    },

    watch: {
           scripts: {
                    files: ['src/**/*'],
                    tasks: ['beautify', 'build'],
                    options: {
                             spawn: false
                    }
           }

    },

    clean: ['dist/', 'docs/'],

    concat: {
      dist: {
        // Replace all 'use strict' statements in the code with a single one at the top
        options: {

          banner: "angular.module('" + moduleName + "', ['ngSanitize']);\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },
        src: ['src/*.js'],
        dest: 'dist/ovh-angular-timeline.js'
      }
    },

    less: {
      dist: {
        files: {
          'dist/ovh-angular-timeline.css':'src/ovh-angular-timeline.less',
          'dist/ovh-angular-timeline-bootstrap.css':'src/ovh-angular-timeline-bootstrap.less',
          'dist/ovh-angular-timeline-animations.css':'src/ovh-angular-timeline-animations.less'
        }
      }
    },

    // To release
    bump       : {
        options : {
            pushTo        : 'origin',
            files         : [
                'package.json',
                'bower.json'
            ],
            updateConfigs : ['pkg', 'bower'],
            commitFiles   : ['-a']
        }
    },

	  // verifies we have formatted our js and HTML according to our style conventions
	  jsbeautifier: {
		  verify : {
			  src:   beautifyFiles,
			  options: {
				  config: '.jsbeautifyrc',
				  mode: 'VERIFY_ONLY'
			  }
		  },
		  update: {
			  src:   beautifyFiles,
			  options: {
				  config: '.jsbeautifyrc'
			  }
		  }
	  },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint:       {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      src:     ['src/!(*spec).js']
    },

    // Test settings
    karma:        {
      unit: {
        options:    {
          logLevel: 'DEBUG'
        },
        browsers:   ['PhantomJS'],
        configFile: 'karma.conf.js',
        singleRun:  true,
        autoWatch:  false
      }
    },
    coveralls: {
      options: {
        coverage_dir:'coverage',
        directory:'coverage/PhantomJS 1.9.7 (Mac OS X)/lcov.info',
        debug: true,
        dryRun: false,
        recursive: false
      }
    }
  });

  grunt.registerTask('serve', ['build','connect', 'watch']);
	grunt.registerTask('beautify', ['jsbeautifier:update']);
  grunt.registerTask('build', [
    'clean', 'less', 'jsbeautifier:verify', 'jshint', 'concat'
  ]);

  grunt.registerTask('default', [
    'build'
    //, 'coveralls'
  ]);

  grunt.registerTask("test", function () {
      grunt.task.run([
          "clean",
          "jshint"
      ]);
  });

  // Increase version number. Type = minor|major|patch
  grunt.registerTask("release", "Release", function () {
      var type = grunt.option("type");
      if (type && ~["patch", "minor", "major"].indexOf(type)) {
          grunt.task.run(["bump-only:" + type]);
      } else {
          grunt.verbose.or.write("You try to release in a weird version type [" + type + "]").error();
          grunt.fail.warn("Please try with --type=patch|minor|major");
      }
  });

};
