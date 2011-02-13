
goog.provide('node.goog.NodeTestInstance');

goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.TestCase');



/**
 * @constructor
 * @param {string} file The filename holding the test that we will be
 *    responsible for.
 * @param {string} args The search args that are passed to the test case for
 *    test lookups.
 * @param {function(goog.testing.TestCase):undefined} onCompleteHandler The
 *    function that will be called when a test case completes.  It also passes
 *    in the test case so the handler can do as they wish with results.
 * @param {string=} testFilter Only run tests with name matching this filter.
 */
node.goog.NodeTestInstance =
    function(file, args, onCompleteHandler, testFilter) {

  /**
   * @private
   * @type {string}
   */
  this.file_ = file;

  /**
   * @private
   * @type {string}
   */
  this.args_ = args;

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
   * The context to use to run all our tests. This stops this test stepping
   * on the toes of all other tests in this suite (managed by nodetestsrunner).
   * If this is null we will run the tests in the global scope (this context)
   * @type {Object}
   * @private
   */
  this.ctx_ = null; // this.initialiseTestingContext_();

  /**
   * @private
   * @type {function(goog.testing.TestCase):undefined}
   */
  this.onCompleteHandler_ = onCompleteHandler;

  this.setUpTestCaseInterceps_(testFilter || '');
  this.overwriteAsyncTestCaseProblemPoints_();
};


/**
 * Sets up any interceptions required into AsyncTestCase to stop any async style
 * problems emerging in these tests.
 * @private
 * @suppress {visibility}
 */
node.goog.NodeTestInstance.prototype.overwriteAsyncTestCaseProblemPoints_ =
    function() {
  // The default createAndInstall relies on TestRunners and other internal
  // goog.testing package which are not available in this context
  goog.testing.AsyncTestCase.createAndInstall =
      goog.bind(this.createAsyncTestCase_, this);

  // The AsyncTestCase pump_ method throws
  // AsyncTestCase.ControlBreakingException which causes all sorts of problems
  // in this context.  Using object 'pump_' notation because
  // @suppress {visibility} is being ignored by the libs compiler
  var opump = goog.testing.AsyncTestCase.prototype['pump_'];
  var that = this;
  goog.testing.AsyncTestCase.prototype['pump_'] = function(opt_doFirst) {
    try {
      opump.call(this, opt_doFirst);
    } catch (ex) {
      // Safe to ignore
      if (ex.isControlBreakingException) {
        that.onTestComplete_();
      } else {
        throw ex;
      }
    }
  };
};


/**
 * Sets up the test filter to use when auto detecting tests.
 * @param {string} filter The filter to apply to the running tests.
 * @private
 */
node.goog.NodeTestInstance.prototype.setUpTestCaseInterceps_ =
    function(filter) {
  // Crazy jibber jabber from goog.testing.TestCase. Ugly code here but little
  // alternative other than re implementing TestCase which is 95% there

  // TODO: Implement better 'testsToRun' support. @see goog.testing.TestCase
  // for details, it should be pretty straight forward, as the testsToRun_
  // map quite flexible.

  global.window = {
    location: {
      search: (this.args_ ? '?runTests=' + this.args_ : ''),
      href: ''
    },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };
  if (this.ctx_) {
    // When the test case is autoDiscoverTests it will look in this 'global'
    // object, which is our context
    goog.testing.TestCase.getGlobals =
        goog.bind(function() { return this.ctx_; }, this);
  }

  // Ignore this, return 1
  goog.testing.TestCase.prototype['countNumFilesLoaded_'] =
      function() { return 1; }

  goog.testing.TestCase.Result.prototype.isStrict = function() { return true; }
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
 * @return {goog.testing.AsyncTestCase} The async test case created.
 */
node.goog.NodeTestInstance.prototype.createAsyncTestCase_ = function() {
  return this.testCase_ = new goog.testing.AsyncTestCase(this.shortName_);
};


/**
 * @private
 * @return {string} The test file contents.
 */
node.goog.NodeTestInstance.prototype.loadTestContents_ = function() {
  return require('fs').readFileSync(this.file_, encoding = 'utf8');
};


/**
 * @private
 * @param {string} contents The test file contents.
 */
node.goog.NodeTestInstance.prototype.loadTestContentsIntoMemory_ =
    function(contents) {
  if (this.shortName_.indexOf('.js') < 0) {
    contents = this.convertHtmlTestToJS_(contents);
  }
  contents = contents.replace(/^#![^\n]+/, '\n'); // remove shebang
  if (this.ctx_) {
    process.binding('evals').Script.
        runInNewContext(contents, this.ctx_, this.shortName_);
  } else {
    process.binding('evals').Script.
        runInThisContext(contents, this.shortName_);
  }
};


/**
 * @private
 */
node.goog.NodeTestInstance.prototype.createAndRunTestCase_ = function() {
  var async = goog.isDefAndNotNull(this.testCase_);
  if (!async) { this.testCase_ = new goog.testing.TestCase(this.shortName_); }
  this.testCase_.autoDiscoverTests();
  this.testCase_.setCompletedCallback(goog.bind(this.onTestComplete_, this));
  this.testCase_.runTests();
};


/**
 * Called when the test case is completed. This method just passes the test
 *    case to the test runner which passes in a handler when creating this
 *    instance.
 * @private
 */
node.goog.NodeTestInstance.prototype.onTestComplete_ = function() {
  if (!this.ctx_) this.clearOutGlobalContext_();
  this.onCompleteHandler_(this.testCase_);
};


/**
 * Clears out the testing stuff from the global context.  This tries to stop
 * the tests stepping on each other's toes
 * @private
 */
node.goog.NodeTestInstance.prototype.clearOutGlobalContext_ = function() {
  for (var i in global) {
    if (i.indexOf('test') === 0 || i.indexOf('setUp') === 0 ||
        i.indexOf('tearDown') === 0) {
      delete global[i];
    }
  }
};


/**
 * @private
 * @return {Object} The testing context to use to run the tests in.
 */
node.goog.NodeTestInstance.prototype.initialiseTestingContext_ = function() {
  var ctx = {
    'require': global.goog.require,
    'goog': global.goog,
    'console': console
  };
  return ctx;
};


/**
 * @private
 * @param {string} html The html file contents.
 * @return {string} The JavaScript contents.
 */
node.goog.NodeTestInstance.prototype.convertHtmlTestToJS_ = function(html) {
  var blocks = [];
  var idx = html.indexOf('<script');
  while (idx >= 0) {
    idx = html.indexOf('>', idx);
    var endIdx = html.indexOf('</script>', idx);
    blocks.push(html.substring(idx + 1, endIdx));
    html = html.substring(endIdx + 9);
    idx = html.indexOf('<script');
  }
  return blocks.join('\n');
};
