// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
    // base path, that will be used to resolve files and exclude
        basePath: "",

    // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ["browserify", "jasmine"],

    // list of files / patterns to load in the browser
        files: [
            "node_modules/lodash/lodash.js",
            "node_modules/angular/angular.js",
            "node_modules/angular-mocks/angular-mocks.js",
            "src/**/*.js"
        ],

    // list of files / patterns to exclude
        exclude: [],

        preprocessors: {
            "src/**/*.js": ["browserify"],
            "test/**/*.js": ["browserify"]
        },

        browserify: {
            debug: true,
            transform: [["babelify", {
                presets: ["es2015"],
                plugins: ["transform-html-import-to-string"]
            }]]
        },


    // web server port
        port: 8081,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
        browsers: ["PhantomJS"],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
