module.exports = function (grunt) {
    "use strict";
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    /**
     * NOTE for CSS/LESS:
     * - (src/CSS -> dist/CSS) : use [concat:css, autoprefixer, cssmin]
     * - (src/LESS -> dist/CSS) : use [less, autoprefixer, cssmin]
     * - (src/LESS -> dist/LESS) : use [copy:less]
     */

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: grunt.file.readJSON("bower.json"),
        distdir: "dist",
        srcdir: "src",
        builddir: ".work/.tmp",
        name: grunt.file.readJSON("package.json").name || "ovh-angular-mondial-relay", // module name

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
                files: [{
                    "<%= distdir %>/<%= name %>.js": "<%= builddir %>/<%= name %>.js"
                }, {
                    expand: true,
                    cwd: "<%= srcdir %>/<%= name %>",
                    dest: "<%= distdir %>",
                    src: [
                        "**/translations/*.json"
                    ]
                }]
            },

            // Copy LESS files to dist/
            less: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= srcdir %>",
                        src: "less/**/*",
                        dest: "<%= distdir %>/"
                    }
                ]
            },
            buildAssets: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= srcdir %>",
                        src: "assets/*.*",
                        dest: "<%= builddir %>/"
                    }
                ]
            }
        },

        // Concatenation
        concat: {
            dist: {
                files: {
                    "<%= builddir %>/<%= name %>.js": [
                        "<%= srcdir %>/<%= name %>.js",
                        "<%= srcdir %>/**/*.js",
                        "<%= builddir %>/template.js",
                        "<%= builddir %>/config.js",
                        "!<%= srcdir %>/**/*.spec.js"
                    ]
                }
            },

            // use this only if you don"t use LESS!
            css: {
                files: {
                    "<%= builddir %>/<%= name %>.css": [
                        "<%= srcdir %>/**/*.css"
                    ]
                }
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
                    banner: "/*! <%= name %> - <%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
                },
                files: {
                    "<%= distdir %>/<%= name %>.min.js": ["<%= builddir %>/<%= name %>.js"]
                }
            }
        },

        // Create CSS from LESS
        less: {
            dist: {
                options: {
                    compress: false
                },
                files: {
                    "<%= builddir %>/<%= name %>.css": ["<%= srcdir %>/**/*.less"]
                }
            }
        },

        // ... and its prefixed vendor styles
        autoprefixer: {
            options: {
                browsers: ["last 3 versions", "ie >= 9", "> 5%"]
            },
            dist: {
                files: {
                    "<%= distdir %>/<%= name %>.css": ["<%= builddir %>/<%= name %>.css"]
                }
            }
        },

        // ... and now minify it
        cssmin: {
            options: {},
            dist: {
                files: {
                    "<%= distdir %>/<%= name %>.min.css": ["<%= distdir %>/<%= name %>.css"]
                }
            }
        },

        base64: {
            images: {
                // Target-specific file lists and/or options go here.
                files: {
                    "<%= builddir %>/img/default.b64": "src/assets/default.png",
                    "<%= builddir %>/img/gmaps_pr02A.b64": "src/assets/gmaps_pr02A.png",
                    "<%= builddir %>/img/gmaps_pr02B.b64": "src/assets/gmaps_pr02B.png",
                    "<%= builddir %>/img/gmaps_pr02C.b64": "src/assets/gmaps_pr02C.png",
                    "<%= builddir %>/img/gmaps_pr02D.b64": "src/assets/gmaps_pr02D.png",
                    "<%= builddir %>/img/gmaps_pr02E.b64": "src/assets/gmaps_pr02E.png",
                    "<%= builddir %>/img/gmaps_pr02F.b64": "src/assets/gmaps_pr02F.png",
                    "<%= builddir %>/img/gmaps_pr02G.b64": "src/assets/gmaps_pr02G.png",
                    "<%= builddir %>/img/gmaps_pr02H.b64": "src/assets/gmaps_pr02H.png",
                    "<%= builddir %>/img/gmaps_pr02I.b64": "src/assets/gmaps_pr02I.png",
                    "<%= builddir %>/img/gmaps_pr02J.b64": "src/assets/gmaps_pr02J.png",
                    "<%= builddir %>/img/gmaps_pr02K.b64": "src/assets/gmaps_pr02K.png",
                    "<%= builddir %>/img/gmaps_pr02L.b64": "src/assets/gmaps_pr02L.png",
                    "<%= builddir %>/img/gmaps_pr02M.b64": "src/assets/gmaps_pr02M.png",
                    "<%= builddir %>/img/gmaps_pr02N.b64": "src/assets/gmaps_pr02N.png",
                    "<%= builddir %>/img/gmaps_pr_shadow.b64": "src/assets/gmaps_pr_shadow.png"
                }
            }
        },

        ngconstant: {
            options: {
                name: "<%! name %>-images",
                dest: "<%= builddir %>/config.js",
                constants: function () {
                    var prefix = "data:image/png;base64,";
                    return {
                        MONDIAL_RELAY_PICS: {
                            "default": prefix + grunt.file.read(grunt.config.data.builddir + "/img/default.b64"),
                            gmaps_pr02A: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02A.b64"),
                            gmaps_pr02B: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02B.b64"),
                            gmaps_pr02C: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02C.b64"),
                            gmaps_pr02D: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02D.b64"),
                            gmaps_pr02E: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02E.b64"),
                            gmaps_pr02F: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02F.b64"),
                            gmaps_pr02G: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02G.b64"),
                            gmaps_pr02H: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02H.b64"),
                            gmaps_pr02I: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02I.b64"),
                            gmaps_pr02J: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02J.b64"),
                            gmaps_pr02K: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02K.b64"),
                            gmaps_pr02L: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02L.b64"),
                            gmaps_pr02M: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02M.b64"),
                            gmaps_pr02N: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr02N.b64"),
                            gmaps_pr_shadow: prefix + grunt.file.read(grunt.config.data.builddir + "/img/gmaps_pr_shadow.b64")
                        }
                    };
                }
            },
            build: {
            }
        },

        ngtemplates: {
            "mondial-relay": {
                cwd: "<%= srcdir %>",
                src: "**/*.html",
                dest: "<%= builddir %>/template.js"
            }
        },

        // JS Check
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            js: [
                "<%= srcdir %>/*.js",
                "<%= srcdir %>/*/*.js",
                "!<%= srcdir %>/**/*.spec.js"
            ]
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
                    halstead: 50,
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

        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
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
        },

        ngdocs: {
            options: {
                dest: "docs",
                html5Mode: false,
                title: "OVH Angular Mondial Relay",
                startPage: "/api/<%= name %>.directive:mondialRelay",
                sourceLink: "https://github.com/ovh-ux/<%= name %>/blob/master/{{file}}#L{{codeline}}"
            },
            api: {
                src: ["src/**/*.js"],
                title: "api"
            }
        },

        // translation
        ovhTranslation: {
            dev: {
                files: [{
                    expand: true,
                    src: ["<%= srcdir %>/**/translations/*.xml"],

                    // dest: "<%= srcdir %>",
                    filter: "isFile",
                    extendFrom: ["en_GB", "fr_FR"]
                }]
            }
        },

        cssUrlEmbed: {
            build: {
                files: {
                    "<%= distdir %>/<%= name %>.css": ["<%= builddir %>/<%= name %>.css"]
                }
            }
        },

        eslint: {
            options: {
                configFile: "./.eslintrc.json"
            },
            target: ["src/**/*.js", "Gruntfile.js", "karma.conf.js"]
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
            "complexity",
            "karma"
        ]);
    });

    grunt.registerTask("build", [
        "clean",
        "base64",
        "ovhTranslation",
        "ngconstant",
        "ngtemplates",
        "concat:dist",
        "ngAnnotate",
        "uglify",
        "less",
        "copy:buildAssets",
        "cssUrlEmbed",
        "cssmin",
        "copy:less",
        "copy:dist",
        "ngdocs"
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
