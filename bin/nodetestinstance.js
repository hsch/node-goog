
goog.provide('node.goog.NodeTestInstance');

goog.require('goog.testing.TestCase');
goog.require('goog.testing.AsyncTestCase');


/**
 * @constructor
 * @param {string} file The filename holding the test that we will be
 *    responsible for.
 * @param {function(goog.testing.TestCase):undefined} onCompleteHandler The
 *    function that will be called when a test case completes.  It also passes
 *    in the test case so the handler can do as they wish with results.
 */
node.goog.NodeTestInstance = function(file, onCompleteHandler) {
  /**
   * @private
   * @type {string}
   */
  this.file_ = file;

  /**
   * @private
   * @type {string}
   */
  this.shortName_ = file.substring(file.lastIndexOf('/') + 1);

  /**
   * @private
   * @type {goog.testing.TestCase}
   */
  this.testCase_;

  /**
   * @private
   * @type {function(goog.testing.TestCase):undefined}
   */
  this.onCompleteHandler_ = onCompleteHandler;

  // Overwrite this functionality (no test runners, etc)
  goog.testing.AsyncTestCase.createAndInstall =
    goog.bind(this.createAsyncTestCase_, this);
};

/**
 * Runs the test
 */
node.goog.NodeTestInstance.prototype.run = function() {
  var contents = this.loadTestContents_();
  this.loadTestContentsIntoMemory_(contents);
  this.createAndRunTestCase_();
};


/**
 * @private
 * @return {goog.testing.AsyncTestCase} The async test case created
 */
node.goog.NodeTestInstance.prototype.createAsyncTestCase_ = function() {
  return this.testCase_ = new goog.testing.AsyncTestCase(this.shortName_);
};

/**
 * @private
 * @return {string} The test file contents
 */
node.goog.NodeTestInstance.prototype.loadTestContents_ = function() {
  return require('fs').readFileSync(this.file_, encoding = 'utf8');
};

/**
 * @private
 * @param {string} contents The test file contents
 */
node.goog.NodeTestInstance.prototype.loadTestContentsIntoMemory_ =
    function(contents) {
  var ctx = this.initialiseTestingContext_();
  if (this.shortName_.indexOf('.js') < 0) {
    contents = this.convertHtmlTestToJS(contents);
  }
  process.binding('evals').Script.
    runInNewContext(contents, ctx, this.shortName_);
};


/**
 * @private
 */
node.goog.NodeTestInstance.prototype.createAndRunTestCase_ = function() {
  var async = goog.isDefAndNotNull(this.testCase_);
  if (!async) this.testCase_ = new goog.testing.TestCase(this.shortName_);
  this.testCase_.autoDiscoverTests();
  this.testCase_.setCompletedCallback(goog.bind(this.onTestComplete_, this));
};

/**
 * Called when the test case is completed. This method just passes the test
 *    case to the test runner which passes in a handler when creating this
 *    instance.
 * @private
 */
node.goog.NodeTestInstance.prototype.onTestComplete_ = function() {
  this.onCompleteHandler_(this.testCase_);
};

/**
 * @private
 * return {Object} The testing context to use to run the tests in
 */
node.goog.NodeTestInstance.prototype.initialiseTestingContext_ = function() {
  // TODO: Give the tests some love
  return {};
};

/**
 * @private
 * @param {string} html The html file contents
 * @return {string} The JavaScript contents
 */
node.goog.NodeTestInstance.prototype.convertHtmlTestToJS = function(html) {
  var blocks = [];
  var idx = html.indexOf('<script');
  while (idx >= 0) {
    idx = html.indexOf('>', idx);
    var endIdx = html.indexOf('</script>', idx);
    blocks.push(html.substring(idx + 1, endIdx));
    html = html.substring(endIdx + 9);
    idx = html.indexOf('<script')
  }
  return blocks.join('\n');
};
