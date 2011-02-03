#!/usr/local/bin/node

/**
 * @fileOverview This test is to try to get the async stuff working better.
 * Currently we cannot get proper logs of async tests and we cannot use
 * googtest with async tests.
 */
var ng_ = require('goog').goog.init();

goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');


testTest = function() {
  asyncTestCase.waitForAsync();
  setTimeout(function() {
    asyncTestCase.continueTesting();
    assertFalse(true);
  }, 50);
};

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();
