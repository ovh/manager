module.exports = function (grunt) {
    "use strict";
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: grunt.file.readJSON("bower.json"),
        distdir: "dist",
        srcdir: "src",
        builddir: ".work/.tmp",
        name: grunt.file.readJSON("package.json").name || "ovh-angular-form-flat",

        // Obfuscate
        uglify: {
            js: {
                options: {
                    banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    "<%= distdir %>/<%= name %>.min.js": "<%= builddir %>/<%= name %>.js"
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= builddir %>",
                        src: "<%= name %>.js",
                        dest: "<%= distdir %>/"
                    }
                ]
            }
        },

        // Clean
        clean: {
            dist: {
                src: [
                    "<%= builddir %>",
                    "<%= distdir %>/*.js"
                ]
            }
        },

        // Concatenation
        concat: {
            dist: {
                files: {
                    "<%= builddir %>/<%= name %>.js": [
                        "<%=srcdir%>/<%= name %>.js",
                        "<%=srcdir%>/**/*.js",
                        "!<%=srcdir%>/**/*.spec.js"
                    ]
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
                    "<%= builddir %>/<%= name %>.css": ["less/<%= name %>.less"]
                }
            }
        },

        // ... and its prefixed vendor styles
        postcss: {
            options: {
                processors: [
                    require("autoprefixer")({ browsers: [">0%"] })
                ]
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

        // Check complexity
        complexity: {
            generic: {
                src: [
                    "<%=srcdir%>/*.js",
                    "<%=srcdir%>/*/*.js"
                ],
                options: {
                    errorsOnly: false,
                    cyclomatic: 12,
                    halstead: 45,
                    maintainability: 82
                }
            }
        },

        // To release
        bump: {
            options: {
                pushTo: "origin",
                files: ["package.json", "bower.json"],
                updateConfigs: ["pkg"],
                commitFiles: ["-a"]
            }
        },

        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },

        ngdocs: {
            options: {
                dest: "docs",
                html5Mode: false,
                title: "Form Flat",
                startPage: "/api/ovh-angular-form-flat",
                sourceLink: "https://github.com/ovh-ux/<%= name %>/blob/master/{{file}}#L{{codeline}}"
            },
            api: {
                src: ["src/**/*.js"],
                title: "api"
            }
        },

        eslint: {
            options: {
                configFile: "./.eslintrc.json"
            },
            target: ["src/**/!(*.spec|*.integration).js", "Gruntfile.js", "karma.conf.js"]
        }

    });

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
        "concat",
        "uglify",
        "less",
        "postcss",
        "cssmin",
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
