// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: "",

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ["jasmine"],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            "bower_components/angular/angular.js",
            "bower_components/angular-sanitize/angular-sanitize.js",
            "bower_components/angular-scroll-glue/src/scrollglue.js",
            "bower_components/angular-mocks/angular-mocks.js",
            "bower_components/jquery/dist/jquery.js",
            // endbower
            "src/ovh-angular-tail-logs.js",
            "src/**/*.js",
            "src/**/*.html"
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8081,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // reporter types:
        // - dots
        // - progress (default)
        // - spec (karma-spec-reporter)
        // - junit
        // - growl
        // - coverage
        reporters: ["spec"],

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        preprocessors: {
            "src/**/*.html": "ng-html2js"
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: "src/",
            moduleName: "templates"
        },

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ["PhantomJS"],

        // browsers: ["Chrome", "Chrome_without_security"],

        // customLaunchers: {
        //   Chrome_without_security: {
        //     base: "Chrome",
        //     flags: ["--disable-web-security"]
        //   }
        // },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
