/*
 * Copyright 2010 Hendrik Schnepel (hendrik.schnepel@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview This file provides the node.js support to handle basic google
 * closure commands such as goog.require and goog.provide.  It also contains
 * hooks and overrides that make dealing with closure which is primarily a
 * web development platform more manageable when using node.js
 *
 * For instructions on using the node-goog project please read the README.md
 *    file.
 * @see README.md
 * @author Hendrik Schnepel (hendrik.schnepel@gmail.com)
 * @author Guido Tapia (guido@tapia.com.au)
 */

global.node = {goog:{}};

/**
 * @constructor
 */
node.goog = function() {};

/**
 * @private
 * @type {extern_fs}
 */
node.goog.fs_ = /** @type {extern_fs} */ (require('fs'));

/**
 * @private
 * @type {extern_path}
 */
node.goog.path_ = /** @type {extern_path} */ (require('path'));

////////////////////////////////////////////////////////////////////////////////
// Check if test, then kill process and run in googtest
////////////////////////////////////////////////////////////////////////////////

/**
 * Determines wether the currently running file, i.e. The file that is being
 * executed by the node.js interpreter is a test file or not.
 * @return {boolean} Wether the currently running file is a testing file or not
 * @private
 */
node.goog.isRunningTestingFile_ = function() {
  var contents = node.goog.fs_.readFileSync(process.argv[1]).toString();
  return contents.toString().search(/\s*goog\s*\.\s*require\(\s*['"]goog\.testing\.jsunit['"]\)/g) >= 0;
};

/**
 * If the current file being executed is a test we actually stop processing and
 * start a new child process that runs this file using googtest
 * @private
 */
node.goog.runCurrentFileInGoogTest_ = function() {
  global.__filename = __filename;
  global.__dirname = __dirname;

  var command = 'googtest ' + process.argv.splice(1).join(' ');

  require('child_process').exec(command, function(err, stdout, stderr) {
    if (err) throw err;
    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);
  });
};

/**
 * Kills the current thread (stops the Node session)
 */
node.goog.killCurrentThread_ = function() {
  process.once('uncaughtException', function(ex) {});
  throw new Error();
};


/**
 * If the currently executing file (being interpreted by Node.js) is a test
 * file, we stop current execution and run the file using googtest.
 */
if (node.goog.isRunningTestingFile_()) {
  node.goog.runCurrentFileInGoogTest_();
  node.goog.killCurrentThread_();
}

////////////////////////////////////////////////////////////////////////////////
// Not a test
////////////////////////////////////////////////////////////////////////////////

if (typeof(goog) !== 'undefined') {
  goog.provide('node.goog');
  goog.provide('node.goog.opts');

  goog.require('goog.string');
  goog.require('node.goog.utils');
  goog.require('goog.Timer');
  goog.require('goog.testing.jsunit');
}


/**
 * @typedef {{
 *    closureBasePath:string,
 *    additionalDeps:Array.<string>,
 *    jsdocToolkitDir:string,
 *    nodeDir:string,
 *    compiler_jar:string,
 *    additionalCompileRoots:Array.<string>,
 *    additionalCompileOptions:Array.<string>,
 *    additionalJSDocToolkitOptions:Array.<string>,
 *    additionalLinterOptions:Array.<string>
 * }}
 */
node.goog.opts;

/**
 * @private
 * @type {Object.<number>}
 */
node.goog.scriptsWritten_ = {};

/**
 * @private
 * @type {boolean}
 */
node.goog.initialised_ = false;

/**
 * @private
 * @type {*}
 */
node.goog.script_ = process.binding('evals').Script;

/**
 * @private
 * @type {node_goog_utils}
 */
node.goog.closureUtils_ = /** @type {node_goog_utils} */
  (require('../bin/utils').closureUtils);

/**
 * @param {node.goog.opts=} opts Parameters object
 * @return {node.goog}
 */
node.goog.prototype.init = function(opts) {
  if (node.goog.initialised_) return this;
  node.goog.initialised_ = true;
  this.opts_ = opts || node.goog.closureUtils_.readSettingObject(null, null);

  // Begin initializing Closure by loading the base module.
  this.loadBaseScript_();
  this.loadGoogDeps_();
  this.loadCurrentScriptDeps_();
  this.loadAdditionalDeps_();

  return this;
};

/**
 * This can be called by any 'node-goog' initiaised system to load
 * additional deps files dynamically.  This is safe to be called even if you are
 * not sure wether the file exists as it will be ignored if the file does not
 * exist.  It is also safe to be called multiple times for the same file as
 * multiple requests are ignored.
 *
 * @param {string} dir The directory with the specified file
 * @param {string} file The dependencies file to load
 */
node.goog.prototype.loadDependenciesFile = function(dir, file) {
  var path = node.goog.closureUtils_.getPath(dir, file);
  if (!node.goog.path_.existsSync(path)) { return; }
  this.loadScript_( dir, file, path );
};

/**
 * Loads additional closure.json files in the specified directory.
 *
 * @param {string} dir The directory holing the closure.json file.
 */
node.goog.prototype.loadAdditionalSettingsFile = function(dir) {
  var path = node.goog.closureUtils_.getPath(dir, 'closure.json');
  var settings = /** @type {node.goog.opts} */
    (node.goog.closureUtils_.readArgsFromJSONFile(dir, path));
  this.loadAdditionalDepsImpl_(settings);
};

/**
 * Load the base.js module and update the following references:
 *
 * goog.global points to the 'window' object in a browser environment. We
 * replace that with our own global context.  We also set window and top which
 * are used by various different portions of the closure library and testing
 * code.
 *
 * Closure loads files by writing out <script> tags. This is fine in a browser
 * but obviously we need to replace this behaviour to make things work on Node.
 *
 * @suppress  {visibility}
 * @private
 */
node.goog.prototype.loadBaseScript_ = function() {
  var basePath = node.goog.closureUtils_.getPath(this.opts_.closureBasePath,
    'closure/goog');
  this.loadScript_( basePath, 'base.js' );
  goog.global = goog.window = global.window = global.top = global;
  var that = this;
	global.goog.writeScriptTag_ = function( filename ) {
		that.loadScript_( basePath, filename );
    return false;
	};

};

/**
 * TODO: This is how we will load and execute JavaScript files. The synchronous
 * implementation seems to be appropriate for loading modules, but one
 * could think about asynchronous loading anyway (especially for later
 * calls to goog.require(...)).
 *
 * TODO: We need to ensure that no script is loaded
 * twice because this would lead to an exception when
 * a Closure namespace is declared more than once.
 * Not sure how Closure handles this, or whether the
 * problem is only circumvented by their compiler.
 *
 * @private
 * @param {string} basedir The directory with the specified file
 * @param {string} filename The file to load
 * @param {string=} path The full path to the file.  This is optional and will
 *    be resolved if not specified.
 */
node.goog.prototype.loadScript_ = function(basedir, filename, path) {
  path = path || (filename.indexOf('/') === 0 ? filename :
    node.goog.closureUtils_.getPath(basedir, filename));

  if ( node.goog.scriptsWritten_[ path ] ) { return; }
  node.goog.scriptsWritten_[ path ] = 1;
  var code = node.goog.fs_.readFileSync( path, 'utf-8' ).
    replace(/^#![^\n]+/, '');
  node.goog.script_.runInThisContext.call(global, code , filename);

  this.scriptLoaded_();
};

/**
 * Every time a script is loaded we check here if any additional initialisation
 * is required to make the loaded mode function correctly.  Namely the timers
 * framework need a bit of extra work to function correctly.
 *
 * @private
 */
node.goog.prototype.scriptLoaded_ = function() {
  /*
   * If the Timer module has been loaded, provide the Node-
   * specific implementation of the *Timeout and *Interval
   * methods.
   */
  if ( goog.Timer && !goog.Timer.defaultTimerObject ) {
    goog.Timer.defaultTimerObject = {
      "setTimeout": setTimeout,
      "clearTimeout": clearTimeout,
      "setInterval": setInterval,
      "clearInterval": clearInterval
    };
  }
};


/**
 * We can now load the Closure dependency tree.
 *
 * TODO: This completes the initialization - more or less. Some modules may
 * require additional work, e.g. timer.js should access Node's implementation
 * of setTimeout etc.
 *
 * @private
 */
node.goog.prototype.loadGoogDeps_ = function() {
	this.loadScript_( this.opts_.closureBasePath, 'closure/goog/deps.js' );
};

/**
 * If the currently executed script has deps.js in its directory also load it
 * as it will contain some additional dependencies which may not be in the
 * additionaDeps declaration of the settings file.
 *
 * @private
 */
node.goog.prototype.loadCurrentScriptDeps_ = function() {
  var file = process.argv[1];
  var depsPath = file.substring(0, file.lastIndexOf('/') + 1);

  if (file.indexOf('compile.js') < 0) {
    this.loadDependenciesFile(depsPath, 'deps.js' );
  }
};


/**
 * Load any additional deps declared.  These can be declared in the global
 * settings file which is in lib/closure.json, in the project source directory
 * i.e. projectsrc/closure.json or via a call to the init method above.
 *
 * @private
 */
node.goog.prototype.loadAdditionalDeps_ = function() {
  this.loadAdditionalDepsImpl_(this.opts_);
};

/**
 * @private
 * @param {node.goog.opts} opts The options object which we will parse for
 *    additional deps.
 */
node.goog.prototype.loadAdditionalDepsImpl_ = function(opts) {
  if (!opts || !opts.additionalDeps) { return; }

  for (var i = 0, len = opts.additionalDeps.length; i < len; i++) {
    var fileName = opts.additionalDeps[i];
    var idx = fileName.lastIndexOf('/');
    this.loadScript_( fileName.substring(0, idx + 1),
      fileName.substring(idx + 1) , fileName);
  }
};

exports.goog = new node.goog();