module.exports = function (grunt) {
    "use strict";
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: grunt.file.readJSON("bower.json"),
        distdir: "dist",
        srcdir: "src",
        builddir: ".work/.tmp",
        name: grunt.file.readJSON("package.json").name || "ovh-angular-browser-alert",   // module name


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
            dist: {
                files: [{
                    "<%= distdir %>/ovh-angular-browser-alert.js": "<%= builddir %>/ovh-angular-browser-alert.js"
                }, {
                    expand: true,
                    cwd: "<%= srcdir %>",
                    dest: "<%= distdir %>",
                    src: [
                        "**/translations/*.json"
                    ]
                }]
            }
        },

    // Babel ES6
        browserify: {
            dist: {
                files: {
                    "<%= builddir %>/ovh-angular-browser-alert.js": "<%= srcdir %>/index.js"
                },
                options: {
                    transform: [["babelify", {
                        presets: ["es2015"],
                        plugins: ["transform-html-import-to-string"]
                    }]],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },

    // ngMin
        ngAnnotate: {
            dist: {
                files: {
                    "<%= builddir %>/sidebar-menu.js": ["<%= builddir %>/sidebar-menu.js"]
                }
            }
        },

    // Obfuscate
        uglify: {
            js: {
                options: {
                    banner: "/*! ovh-angular-browser-alert - <%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> */\n"
                },
                files: {
                    "<%= distdir %>/ovh-angular-browser-alert.min.js": ["<%= builddir %>/ovh-angular-browser-alert.js"]
                }
            }
        },

    // JS Check
        eslint: {
            target: [
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

    // Testing
        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },

    // Documentation
        ngdocs: {
            options: {
                dest: "docs",
                html5Mode: false,
                title: "Deprecated Browser Alert",
                startPage: "docs/browserAlert"
            },
            docs: {
                src: ["src/**/*.js"],
                title: "API",
                api: true
            }
        },

    // DOCS connect
        connect: {
            docs: {
                options: {
                    port: 9090,
                    base: "docs/",
                    keepalive: true
                }
            }
        },

    // Package all the html partials into a single javascript payload
        ngtemplates: {
            options: {
        // This should be the name of your apps angular module
                module: "browserAlert",
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            main: {
                cwd: "<%=srcdir%>",
                src: ["**/*.html"],
                dest: "<%=builddir%>/templates.js"
            }
        },

        wiredep: {
            test: {
                src: "./karma.conf.js",
                devDependencies: true
            }
        },

        bump: {
            options: {
                pushTo: "origin",
                files: ["package.json", "bower.json"],
                updateConfigs: ["pkg", "bower"],
                commitFiles: ["-a"]
            }
        }
    });

    grunt.registerTask("buildProd", [
        "clean",
        "ngtemplates",
        "eslint",
        "complexity",
        "browserify",
        "uglify",
        "copy:dist",
        "ngdocs"
    ]);

    grunt.registerTask("default", ["buildProd"]);

    grunt.task.renameTask("watch", "delta");
    grunt.registerTask("watch", ["buildProd", "delta"]);

    grunt.registerTask("test", ["karma"]);

  // Increase version number. Type = minor|major|patch
    grunt.registerTask("release", "Release", () => {
        const type = grunt.option("type");

        if (type && ~["patch", "minor", "major"].indexOf(type)) {
            grunt.task.run([`bump-only:${type}`]);
        } else {
            grunt.verbose.or.write(`You try to release in a weird version type [${type}]`).error();
            grunt.fail.warn("Please try with --type=patch|minor|major");
        }
    });

};
