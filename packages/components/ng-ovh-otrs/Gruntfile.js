module.exports = function (grunt) {
    "use strict";
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: grunt.file.readJSON("bower.json"),
        distdir: "dist",
        srcdir: "./src",
        builddir: ".work/.tmp",
        name: grunt.file.readJSON("package.json").name || "ovh-angular-otrs", // module name

        // Clean
        clean: {
            dist: {
                src: [
                    "<%= builddir %>",
                    "<%= distdir %>"
                ]
            }
        },

        // Copy files
        copy: {
            // Copy concatened JS file from builddir to dist/
            dist: {
                files: [
                    {
                        expand: false,
                        dest: "./<%= distdir %>/<%= name %>.js",
                        src: ["./<%= builddir %>/<%= name %>.js"]
                    }
                ]
            }
        },

        ovhTranslation: {
            files: {
                expand: true,
                flatten: false,
                cwd: "<%= srcdir %>",
                src: [
                    "translations/*.xml"
                ],
                dest: "<%= distdir %>",
                filter: "isFile",
                extendFrom: ["fr_FR", "en_GB"]
            }
        },

        // Concatenation
        concat: {
            dist: {
                files: {
                    "<%= builddir %>/<%= name %>.js": [
                        "<%= srcdir %>/otrs.module.js",
                        "<%= srcdir %>/**/*.js",
                        "<%= builddir %>/templates-app.js",
                        "!<%= srcdir %>/**/*.spec.js"
                    ]
                }
            },
            less: {
                files: {
                    "<%= distdir %>/<%= name %>.less": ["<%= srcdir %>/{,**}/*.less"]
                }
            }
        },

        ngtemplates: {
            options: {
                module: "<%= name %>",
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                prefix: "app/module-otrs/"
            },

            dist: {
                cwd: "<%= srcdir %>",
                src: ["{,**}/*.html"],
                dest: "<%= builddir %>/templates-app.js"
            }
        },

        // ngMin
        ngAnnotate: {
            dist: {
                files: {
                    "<%= builddir %>/<%= name %>.js": ["<%= builddir %>/<%= name %>.js"]
                }
            }
        },

        // Obfuscate
        uglify: {
            js: {
                options: {
                    banner: '/*! <%= name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    "<%= distdir %>/<%= name %>.min.js": ["<%= builddir %>/<%= name %>.js"]
                }
            }
        },

        eslint: {
            options: {
                configFile: "./.eslintrc.json",
                quiet: true
            },
            target: ["src/**/!(*.spec|*.integration).js"]
        },

        // Check complexity
        complexity: {
            generic: {
                src: [
                    "<%= srcdir %>/**/*.js",
                    "!<%= srcdir %>/**/*.spec.js"
                ],
                options: {
                    errorsOnly: false,
                    cyclomatic: 12,
                    halstead: 45,
                    maintainability: 82
                }
            }
        },

        // Watch
        delta: {
            dist: {
                files: ["<%= srcdir %>/**/*", "!<%= srcdir %>/**/*.spec.js"],
                tasks: ["build"]
            },
            test: {
                files: ["<%= srcdir %>/**/*.spec.js"],
                tasks: ["test"]
            }
        },

        // To release
        bump: {
            options: {
                pushTo: "origin",
                files: [
                    "package.json",
                    "bower.json"
                ],
                updateConfigs: ["pkg", "bower"],
                commitFiles: ["-a"]
            }
        }
    });


    grunt.registerTask("default", ["build"]);
    grunt.task.renameTask("watch", "delta");
    grunt.registerTask("watch", ["build", "delta"]);

    grunt.registerTask("test", ["eslint"]);

    grunt.registerTask("build", [
        "clean",
        "eslint",
        "ngtemplates:dist",
        "concat:dist",
        "concat:less",
        "ngAnnotate",
        "uglify",
        "copy:dist",
        "ovhTranslation"
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
