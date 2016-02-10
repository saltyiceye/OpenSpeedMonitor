// Karma configuration
// Generated on Mon Dec 14 2015 12:27:49 GMT+0100 (CET)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'grails-app/assets/javascripts/csi/defaultMappingCsvValidator.js',
            'test/unit/javascript/specs/**/*.js'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'junit'],
        junitReporter: {
            outputDir: 'target/test-reports/javascript',
            outputFile: 'test-results.xml',
            useBrowserName: false,
            suite: ''
        },
        //remoteReporter: {
        //    host: 'localhost',
        //    port: '9889'
        //},


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultanous
        concurrency: Infinity,

        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-remote-reporter',
            'karma-junit-reporter'
        ]
    })
};