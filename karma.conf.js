var webpackConfig = require('./webpack.test.conf');

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    reporters: ['spec', 'coverage'],
    files: [
      './node_modules/babel-polyfill/dist/polyfill.js',
      './test.js'
    ],
    preprocessors: {
      './test.js': ['webpack', 'sourcemap']
      // './test.js': ['sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    logLevel: config.LOG_INFO,
  })
}
