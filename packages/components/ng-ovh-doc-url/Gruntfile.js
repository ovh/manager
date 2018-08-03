// Generated on 2017-03-06 using generator-ovh-angular-component 0.1.0
module.exports = function (grunt) {
    'use strict';
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg      : grunt.file.readJSON('package.json'),
        bower    : grunt.file.readJSON('bower.json'),
        distdir  : 'dist',
        srcdir   : 'src',
        builddir : '.work/.tmp',
        name     : grunt.file.readJSON('package.json').name || 'ovh-angular-doc-url',   // module name

        // Clean
        clean      : {
            dist : {
                src : [
                    '<%= builddir %>',
                    '<%= distdir %>'
                ]
            }
        },

        // Copy files
        copy : {
            // Copy concatened JS file from builddir to dist/
            dist : {
                files : {
                    '<%= distdir %>/ovh-angular-doc-url.js' : '<%= builddir %>/ovh-angular-doc-url.js'
                }
            }
        },

        // Concatenation
        concat     : {
            dist : {
                files : {
                    '<%= builddir %>/ovh-angular-doc-url.js' : [
                        '<%= srcdir %>/ovh-angular-doc-url.js',
                        '<%= srcdir %>/**/*.js',
                        '!<%= srcdir %>/**/*.spec.js'
                    ]
                }
            }
        },

        // ngMin
        ngAnnotate: {
            dist: {
                files: {
                    '<%= builddir %>/ovh-angular-doc-url.js' : ['<%= builddir %>/ovh-angular-doc-url.js']
                }
            }
        },

        // Obfuscate
        uglify   : {
            js : {
                options : {
                    banner : '/*! ovh-angular-doc-url - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files   : {
                    '<%= distdir %>/ovh-angular-doc-url.min.js' : ['<%= builddir %>/ovh-angular-doc-url.js']
                }
            }
        },

        // Check complexity
        complexity : {
            generic : {
                src     : [
                    '<%= srcdir %>/**/*.js',
                    '!<%= srcdir %>/**/*.spec.js'
                ],
                options : {
                    errorsOnly      : false,
                    cyclomatic      : 12,
                    halstead        : 45,
                    maintainability : 82
                }
            }
        },

        // Watch
        delta : {
            dist: {
                files : ['<%= srcdir %>/**/*', '!<%= srcdir %>/**/*.spec.js'],
                tasks: ['buildProd']
            },
            test: {
                files : ['<%= srcdir %>/**/*.spec.js'],
                tasks: ['test']
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

        // Testing
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        // Documentation
        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false,
                title: 'ovh-angular-doc-url'
            },
            docs: {
                src: ['src/**/*.js'],
                title: 'docs'
            }
        }
    });

    grunt.registerTask('buildProd', [
        'clean',
        'complexity',
        'concat:dist',
        'ngAnnotate',
        'uglify',
        'copy:dist',
        'ngdocs'
    ]);

    grunt.registerTask('default', ['buildProd']);

    grunt.task.renameTask('watch', 'delta');
    grunt.registerTask('watch', ['buildProd', 'delta']);

    grunt.registerTask('test', ['karma']);

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
