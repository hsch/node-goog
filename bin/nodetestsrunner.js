
goog.provide('node.goog.NodeTestsRunner');

goog.require('goog.array');
goog.require('node.goog.NodeTestInstance');

/**
 * @constructor
 * @param {Array.<string>} testFiles The test files to test
 */
node.goog.NodeTestsRunner = function(testFiles) {
  /**
   * The test files to test, this will be 'pop'ed as these are run.
   * @private
   * @type {Array.<string>}
   */
  this.testFiles_ = goog.array.clone(testFiles);

  /**
   * When test instances complete the running of their test cases they get
   *  stored here so we can then use this information to display results.
   * @private
   * @type {Array.<goog.testing.TestCase>}
   */
  this.completedTestCases_ = [];
};

/**
 * Executes the tests
 */
node.goog.NodeTestsRunner.prototype.execute = function() {
  this.runNextTest_();
}

/**
 * Runs the next test in the queue or calls displayResults_
 * @private
 */
node.goog.NodeTestsRunner.prototype.runNextTest_ = function() {
  if (this.testFiles_.length === 0) {
    this.displayResults_();
    return;
  }
  this.runNextTestImpl_(this.testFiles_.pop());
};

/**
 * Runs the next specified test
 * @param {string} file
 * @private
 */
node.goog.NodeTestsRunner.prototype.runNextTestImpl_ = function(file) {
  var instance = new node.goog.NodeTestInstance(file,
    goog.bind(this.onTestCompleted_, this));
  instance.run();
};

/**
 * @private
 * @param {goog.testing.TestCase} tc The test case that just completed
 */
node.goog.NodeTestsRunner.prototype.onTestCompleted_ = function(tc) {
  this.completedTestCases_.push(tc);
  this.runNextTest_();
};

/**
 * @private
 * Spits the results to the console
 */
node.goog.NodeTestsRunner.prototype.displayResults_ = function() {
  console.log('RESULTS\n=======');
  goog.array.forEach(this.completedTestCases_, this.renderTestCase_, this);
};

/**
 * @private
 * Renders the test case to the console.
 * @param {goog.testing.TestCase} tc The test case to render results.
 */
node.goog.NodeTestsRunner.prototype.renderTestCase_ = function(tc) {
  var report = tc.getReport(false);
  console.log(this.colorizeReport(report));
};

/**
 * @param {string} report The test report to colorize.
 * @return {string} The colorized report.
 */
node.goog.NodeTestsRunner.prototype.colorizeReport = function(report) {
  var lines = report.replace(/\s*$/, '').split('\n');
  // Remove empty lines
  lines = goog.array.filter(lines, function(l) { return l !== ''; });
  var isSuccess = true;
  lines = goog.array.map(lines, function(l) {
    if (l.indexOf('[FAILED]') > 0) {
      isSuccess = false;
    } else if (l.indexOf('[SUCCESS]') > 0) {
      isSuccess = true;
    }
    return (isSuccess ? '\x1B[0;32m' : '\x1B[0;31m') + l;
  });
  var titleLen = lines[0].length - 7; // 7 for the color
  var underline = node.goog.NodeTestsRunner.padString_('', titleLen, '-');
  lines.splice(1, 0, underline);
  return lines.join('\n');
};


/**
 * Gets a string padded with given character to get given size.
 * @param {string} str The given string to be padded.
 * @param {number} length The target size of the string.
 * @param {string} ch The character to be padded with.
 * @return {string} The padded string.
 * @private
 */
node.goog.NodeTestsRunner.padString_ = function(str, length, ch) {
  while (str.length < length) {
    str = ch + str;
  }
  return str;
};