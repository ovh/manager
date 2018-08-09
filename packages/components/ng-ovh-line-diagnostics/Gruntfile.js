module.exports = function (grunt) {
    "use strict";
    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.loadTasks("./tasks");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: grunt.file.readJSON("bower.json"),
        distdir: "dist",
        srcdir: "src",
        builddir: ".work/.tmp",
        transdir: ".work/.trans",

        // Obfuscate
        uglify: {
            js: {
                options: {
                    banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    "<%= distdir %>/ovh-angular-line-diagnostics.min.js": "<%= builddir %>/ovh-angular-line-diagnostics.js"
                }
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= builddir %>",
                        src: ["ovh-angular-line-diagnostics.js"],
                        dest: "<%= distdir %>"
                    },
                    {
                        expand: true,
                        cwd: "<%= srcdir %>/ovh-angular-line-diagnostics",
                        dest: "<%= distdir %>",
                        src: ["translations/*.json"]
                    }
                ]
            }
        },

        ngtemplates: {
            "ovh-angular-line-diagnostics": {
                src: "<%=srcdir%>/ovh-angular-line-diagnostics/**/*.html",
                dest: "<%=builddir%>/templates.js",
                options: {
                    app: "ovh-angular-line-diagnostics",
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    prefix: "/ovh-angular-line-diagnostics/",
                    standalone: false
                }
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

        // Clean
        clean: {
            dist: {
                src: ["<%= builddir %>", "<%= distdir %>", "<%= transdir %>"]
            }
        },

        // JS Check
        eslint: {
            options: {
                quiet: true
            },
            target: ["<%=srcdir%>/*.js", "<%=srcdir%>/*/*.js"]
        },

        // Concatenation
        concat: {
            dist: {
                files: {
                    "<%= transdir %>/ovh-angular-line-diagnostics.js": [
                        "<%=srcdir%>/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.js",
                        "<%=srcdir%>/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.component.js",
                        "<%=srcdir%>/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.constant.js",
                        "<%=srcdir%>/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.factory.js",
                        "<%=srcdir%>/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.provider.js",
                        "<%=builddir%>/templates.js"
                    ]
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ["es2015"]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= transdir %>",
                        src: ["*.js"],
                        dest: "<%= builddir %>"
                    }
                ]
            }
        },

        less: {
            dist: {
                options: {
                    compress: false,
                    cleancss: true
                },
                files: {
                    "<%= distdir %>/ovh-angular-line-diagnostics.min.css": ["<%=srcdir%>/*/*.less"]
                }
            }
        },

        // Check complexity
        complexity: {
            generic: {
                src: ["<%=builddir%>/*.js", "<%=builddir%>/*/*.js"],
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
                updateConfigs: ["pkg", "bower"],
                commitFiles: ["-a"]
            }
        }
    });

    grunt.registerTask("default", ["build"]);
    grunt.task.renameTask("watch", "delta");
    grunt.registerTask("watch", ["build", "delta"]);

    grunt.registerTask("test", () => {
        grunt.task.run(["clean", "eslint"]);
    });

    grunt.registerTask("build", ["eslint", "clean", "ovhTranslation", "ngtemplates", "concat", "babel", "complexity", "uglify", "copy:dist", "less:dist"]);

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
