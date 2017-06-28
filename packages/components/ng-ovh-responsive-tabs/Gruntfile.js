module.exports = function (grunt) {
    'use strict';
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    /**
     * NOTE for CSS/LESS:
     * - (src/CSS -> dist/CSS) : use [concat:css, autoprefixer, cssmin]
     * - (src/LESS -> dist/CSS) : use [less, autoprefixer, cssmin]
     * - (src/LESS -> dist/LESS) : use [copy:less]
     */

    grunt.initConfig({
        pkg      : grunt.file.readJSON('package.json'),
        bower    : grunt.file.readJSON('bower.json'),
        distdir  : 'dist',
        srcdir   : 'src',
        builddir : '.work/.tmp',
        name     : grunt.file.readJSON('package.json').name || 'ovh-angular-responsive-tabs',   // module name

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
                    '<%= distdir %>/<%= name %>.js' : '<%= builddir %>/<%= name %>.js'
                }
            }
        },

        // Concatenation
        concat     : {
            dist : {
                files : {
                    '<%= builddir %>/<%= name %>.js' : [
                        '<%= srcdir %>/<%= name %>.js',
                        '<%= srcdir %>/**/*.js',
                        '<%= builddir %>/tpls.js',
                        '!<%= srcdir %>/**/*.spec.js'
                    ]
                }
            }
        },

        // ngMin
        ngAnnotate: {
            dist: {
                files: {
                    '<%= builddir %>/<%= name %>.js' : ['<%= builddir %>/<%= name %>.js']
                }
            }
        },

        ngtemplates: {
            options: {
                module: 'responsiveTabs',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            dist: {
                cwd    : '<%= srcdir %>/',
                src    : ['**/*.html'],
                dest   : '<%= builddir %>/tpls.js'
            }
        },

        // Obfuscate
        uglify   : {
            js : {
                options : {
                    banner : '/*! <%= name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files   : {
                    '<%= distdir %>/<%= name %>.min.js' : ['<%= builddir %>/<%= name %>.js']
                }
            }
        },

        // JS Check
        jshint     : {
            options : {
                jshintrc : '.jshintrc',
                reporter: require('jshint-stylish')
            },
            js      : [
                '<%= srcdir %>/*.js',
                '<%= srcdir %>/*/*.js',
                '!<%= srcdir %>/**/*.spec.js'
            ]
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
                tasks: ['build']
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

        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false,
                title: 'Responsive tabs',
                startPage: '/api/responsiveTabs.directive:responsiveTabs',
                sourceLink: 'https://github.com/ovh-ux/<%= name %>/blob/master/{{file}}#L{{codeline}}'
            },
            api: {
                src: ['src/**/*.js'],
                title: 'api'
            }
        },

        eslint: {
            options: {
                configFile: "./.eslintrc.json",
                fix: true
            },
            target: ["src/**/!(*.spec|*.integration).js"]
        }
    });

    grunt.registerTask("default", ["build"]);
    grunt.task.renameTask("watch", "delta");
    grunt.registerTask("watch", ["build", "delta"]);

    grunt.registerTask("test", function () {
        grunt.task.run([
            "clean",
            "jshint",
            "eslint",
            "complexity"/*,
            "karma"*/
        ]);
    });

    grunt.registerTask("build", [
        "clean",
        "ngtemplates",
        "concat:dist",
        "ngAnnotate",
        "uglify",
        "copy:dist",
        'ngdocs'
    ]);


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
