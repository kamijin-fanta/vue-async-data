// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')

const testsContextInSrc = require.context('./src', true, /\/(?!.*\.es5)\.*/)
testsContextInSrc.keys().forEach(testsContextInSrc);
