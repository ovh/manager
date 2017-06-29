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
        name: grunt.file.readJSON("package.json").name || "ovh-angular-responsive-page-switcher", // module name

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
                files: {
                    "<%= distdir %>/<%= name %>.js": "<%= builddir %>/<%= name %>.js"
                }
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
            }
        },

        // Concatenation
        concat: {
            dist: {
                files: {
                    "<%= builddir %>/<%= name %>.js": [
                        "<%= srcdir %>/<%= name %>.js",
                        "<%= srcdir %>/**/*.js",
                        "!<%= srcdir %>/**/*.spec.js"
                    ]
                }
            },

            // use this only if you don't use LESS!
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
                    banner: '/*! <%= name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
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
            },
            example: {
                options: {
                    compress: false
                },
                files: {
                    "<%= builddir %>/<%= name %>.example.css": ["example/**/*.less"]
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
            },
            example: {
                files: {
                    "example/example.css": ["<%= builddir %>/<%= name %>.example.css"]
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
                tasks: ["buildProd"]
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
        },

        // Testing
        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },

        // Example
        wiredep: {
            example: {
                src: "example/index.html",
                overrides: {},
                devDependencies: true,
                exclude: ["angular-sanitize", "angular-mocks", "angular-scenario"]
            }
        },

        injector: {
            example: {
                options: {
                    transform: function (filePath) {
                        return '<script src="' + filePath + '" type="text/javascript"></script>';
                    },
                    starttag: "<!-- injector:js -->",
                    endtag: "<!-- endinjector:js -->"
                },
                files: {
                    "example/index.html": [
                        "<%= distdir %>/<%= name %>.js",
                        "example/<%= name %>.example.js"
                    ]
                }
            },
            exampleCss: {
                options: {
                    transform: function (filePath) {
                        return '<link rel="stylesheet" href="..' + filePath + '">';
                    },
                    starttag: "<!-- injector:css -->",
                    endtag: "<!-- endinjector:css -->"
                },
                files: {
                    "example/index.html": [
                        "<%= distdir %>/<%= name %>.css",
                        "bower_components/responsive-popover/dist/responsive-popover.css",
                        "bower_components/bootstrap/dist/css/bootstrap.css"
                    ]
                }
            }
        },

        connect: {
            options: {
                port: 7711,
                hostname: "*"
            },
            example: {
                options: {
                    keepalive: true
                }
            }
        }
    });

    grunt.registerTask("example", ["wiredep:example", "less:example", "autoprefixer:example", "injector:example", "injector:exampleCss", "connect:example"]);

    grunt.registerTask("default", ["build"]);
    grunt.task.renameTask("watch", "delta");
    grunt.registerTask("watch", ["build", "delta"]);

    grunt.registerTask("test", function () {
        grunt.task.run([
            "clean",
            "eslint",
            "complexity",
            "karma"
        ]);
    });

    grunt.registerTask("build", [
        "clean",
        "concat:dist",
        "ngAnnotate",
        "uglify",
        "less:dist",
        "autoprefixer:dist",
        "cssmin",
        "copy:less",
        "copy:dist"
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
