module.exports = function (grunt) {
    "use strict";
    var config = require('./Build.config');

    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg         : grunt.file.readJSON('package.json'),
        pkgName     : grunt.file.readJSON('package.json').name.split("/")[1],
        bower       : grunt.file.readJSON('bower.json'),

        bowerdir    : 'components',
        builddir    : '.tmp',
        srcdir      : 'src',
        distdir     : 'bin',

        clean : {
            files : [
                '<%= builddir %>/*',
                '<%= distdir %>/*'
            ]
        },

        jshint: {
            options : {
                jshintrc : '.jshintrc'
            },
            js      : [config.src.js, '!lib/core.js']
        },

        concat  : {
            dist : {
                src : config.src.js,
                dest    : '<%= distdir %>/<%=pkgName%>.js'
            },
            distTpls : {
                src : ['<%= distdir %>/<%=pkgName%>.js', '<%= builddir %>/tpls.js'],
                dest    : '<%= distdir %>/<%=pkgName%>.tpls.js'
            }
        },

        copy    : {
            template : {
                files : [{
                    expand : true,
                    cwd    : '<%= srcdir %>/',
                    src    : ['*/**/**.html', '*/**/**.css'],
                    dest   : '<%= distdir %>/template/'
                }]
            }
        },

        uglify: {
            dist : {
                src     : [
                    '<%= concat.dist.dest %>'
                ],
                dest    : '<%= distdir %>/<%=pkgName%>.min.js'
            },
            distTpls : {
                src     : [
                    '<%= concat.distTpls.dest %>'
                ],
                dest    : '<%= distdir %>/<%=pkgName%>.tpls.min.js'
            }
        },

        complexity: {
            generic: {
                src     : [config.src.js, '!lib/core.js'],
                options : {
                    errorsOnly: false,
                    cyclomatic: 16,
                    halstead: 45,
                    maintainability: 86
                }
            }
        },

        ngtemplates: {
            options: {
                module: 'ovh-utils-angular',
                url:    function (url) { return "js/ovh-utils-angular/" + url; },
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
                src    : ['*/**/**.html'],
                dest   : '<%= builddir %>/tpls.js'
            }
        },

        // To release
        bump            : {
            options : {
                pushTo        : 'origin v11.x.x',
                files         : ['package.json', 'bower.json'],
                updateConfigs : ['pkg', 'bower'],
                commitFiles   : ['-a']
            }
        },

        rename: {
            dev: {
                files: [
                    {src: ['<%= distdir %>/ovh-utils-angular.js'],      dest: '<%= distdir %>/ovh-utils-angular.min.js'},
                    {src: ['<%= distdir %>/ovh-utils-angular.tpls.js'], dest: '<%= distdir %>/ovh-utils-angular.tpls.min.js'},
                ]
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'jshint',
        'complexity',
        'ngtemplates',
        'concat',
        'uglify',
        'copy'
    ]);

    grunt.registerTask('dev', [
        'clean',
        'jshint',
        'complexity',
        'ngtemplates',
        'concat',
        'uglify',
        'copy',
        'rename:dev'
    ]);

    /*
     * --type=patch
     * --type=minor
     * --type=major
     */
    grunt.registerTask('release', 'Release', function () {
        var type = grunt.option('type');
        grunt.task.run(['bump-only:' + type, 'default', 'bump-commit']);
    });

};
