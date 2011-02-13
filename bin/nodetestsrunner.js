
goog.provide('node.goog.NodeTestsRunner');

goog.require('goog.array');
goog.require('goog.testing.stacktrace');
goog.require('node.goog.NodeTestInstance');



/**
 * @constructor
 * @param {Array.<string>} testFiles The test files to test.
 * @param {string} args Any args used to find appropriate tests to run.
 */
node.goog.NodeTestsRunner = function(testFiles, args) {
  /**
   * The test files to test, this will be 'pop'ed as these are run.
   * @private
   * @type {Array.<string>}
   */
  this.testFiles_ = goog.array.clone(testFiles);

  /**
   * @private
   * @type {string}
   */
  this.args_ = args;

  /**
   * When test instances complete the running of their test cases they get
   *  stored here so we can then use this information to display results.
   * @private
   * @type {Array.<goog.testing.TestCase>}
   */
  this.completedTestCases_ = [];

  // Some require overrides to make stack traces properly visible
  goog.testing.stacktrace.parseStackFrame_ =
      node.goog.NodeTestsRunner.parseStackFrameLine_;
  goog.testing.stacktrace.framesToString_ =
      node.goog.NodeTestsRunner.stackFramesToString_;
};


/**
 * Executes the tests
 */
node.goog.NodeTestsRunner.prototype.execute = function() {
  this.runNextTest_();
};


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
 * @param {string} file The spricific test to run.
 * @private
 */
node.goog.NodeTestsRunner.prototype.runNextTestImpl_ = function(file) {
  var instance = new node.goog.NodeTestInstance(file, this.args_,
      goog.bind(this.onTestCompleted_, this));
  instance.run();
};


/**
 * @private
 * @param {goog.testing.TestCase} tc The test case that just completed.
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
  console.log('\x1B[0;34m\n=======\nRESULTS\n=======');
  var results = goog.array.map(this.completedTestCases_,
      node.goog.NodeTestsRunner.renderTestCase_, this);
  console.log(results.join('\n\n'));
};


/**
 * @private
 * Renders the test case to the console.
 * @param {goog.testing.TestCase} tc The test case to render results.
 * @return {string} A string representation of this test case.
 */
node.goog.NodeTestsRunner.renderTestCase_ = function(tc) {
  return node.goog.NodeTestsRunner.colorizeReport(tc.getReport(false));
};


/**
 * @param {string} report The test report to colorize.
 * @return {string} The colorized report.
 */
node.goog.NodeTestsRunner.colorizeReport = function(report) {
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


/**
 * For each raw text line find an appropriate 'goog.testing.stacktrace.Frame'
 * object which constructs with these args:
 *  {string} context Context object, empty in case of global functions
 *    or if the browser doesn't provide this information.
 *  {string} name Function name, empty in case of anonymous functions.
 *  {string} alias Alias of the function if available. For example the
 *    function name will be 'c' and the alias will be 'b' if the function is
 *    defined as <code>a.b = function c() {};</code>.
 *  {string} args Arguments of the function in parentheses if available.
 *  {string} path File path or URL including line number and optionally
 *   column number separated by colons
 *
 * @private
 * @param {string} line A line in the stack trace.
 * @return {goog.testing.stacktrace.Frame} The parsed frame.
*/
node.goog.NodeTestsRunner.parseStackFrameLine_ = function(line) {
  if (!line || line.indexOf('    at ') !== 0) { return null; }
  line = line.substring(line.indexOf(' at ') + 4);
  // return new goog.testing.stacktrace.Frame('', line, '', '', line);

  if (line.charAt(0) === '/') { // Path to test file
    return new goog.testing.stacktrace.Frame('', '', '', '', line);
  }
  var contextAndFunct = line.substring(0, line.lastIndexOf(' ')).split('.');
  var context = '';
  var funct = '';
  if (contextAndFunct.length === 1) {
    funct = contextAndFunct[0];
  } else {
    context = contextAndFunct[0];
    funct = contextAndFunct[1];
  }
  var path = line.substring(line.indexOf('(') + 1);

  return new goog.testing.stacktrace.Frame(context, funct, '', '',
      path.substring(0, path.length - 1));
};


/**
 * Converts the stack frames into canonical format. Chops the beginning and the
 * end of it which come from the testing environment, not from the test itself.
 * @param {!Array.<goog.testing.stacktrace.Frame>} frames The frames.
 * @return {string} Canonical, pretty printed stack trace.
 * @private
 */
node.goog.NodeTestsRunner.stackFramesToString_ = function(frames) {
  var stack = [];
  for (var i = 0, len = frames.length; i < len; i++) {
    var f = frames[i];
    if (!f) continue;
    var str = f.toCanonicalString();
    var ignorestr = '[object Object].execute (testing/testcase.js:900:12)';
    if (str.indexOf(ignorestr) === 0) { break; }
    stack.push('> ');
    stack.push(str);
    stack.push('\n');
  }
  return stack.join('');
};
