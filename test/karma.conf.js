module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'jasmine'],


    // for more information https://www.npmjs.com/package/karma-jspm
    jspm: {
      loadFiles: ['www/**/*.js']
    },


    proxies: {
      '/jspm_packages/': '/base/jspm_packages/',
      '/src/': '/base/src/'
    },


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular2/bundles/angular2-polyfills.js', // Required for all major browsers
      'node_modules/es6-shim/es6-shim.js', // Required by PhantomJS2
      'jspm_packages/system-polyfills.js'  // Required by PhantomJS2
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/app/**/!(*.spec).js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress', 'mocha', 'coverage'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],



    coverageReporter: {
      includeAllSources: true,
      reporters: [
        { type: 'text-summary' }
      ]
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS2'], // 'Chrome'


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,


    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
};
