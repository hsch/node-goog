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

if (typeof(goog) !== 'undefined') {
  goog.provide('NodeGoog');

  goog.require('goog.Timer');
  goog.require('goog.testing.jsunit');
}

/**
 * @constructor
 */
NodeGoog = function() {};

/**
 * @private
 * @type {Object.<number>}
 */
NodeGoog.scriptsWritten_ = {};

/**
 * @private
 * @type {boolean}
 */
NodeGoog.initialised_ = false;

/**
 * @private
 * @type {extern_fs}
 */
NodeGoog.fs_ = /** @type {extern_fs} */ (require('fs'));

/**
 * @private
 * @type {extern_path}
 */
NodeGoog.path_ = /** @type {extern_path} */ (require('path'));

/**
 * @private
 * @type {*}
 */
NodeGoog.script_ = process.binding('evals').Script;

/**
 * @private
 * @type {common_utils_extern}
 */
NodeGoog.closureUtils_ = /** @type {common_utils_extern} */
  (require('../bin/utils').closureUtils);

/**
 * @param {node_goog.opts=} opts Parameters object
 * @return {NodeGoog}
 */
NodeGoog.prototype.init = function(opts) {
  if (NodeGoog.initialised_) return this;
  NodeGoog.initialised_ = true;
  this.opts_ = opts || NodeGoog.closureUtils_.readSettingObject();

  // Begin initializing Closure by loading the base module.
  this.loadBaseScript_();

  this.loadGoogDeps_();
  this.loadCurrentScriptDeps_();
  this.loadAdditionalDeps_();

  return this;
};

/**
 * @return {common_utils_extern} Returns a reference to the static utils object.
 */
NodeGoog.prototype.getUtils = function() {
  return NodeGoog.closureUtils_;
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
NodeGoog.prototype.loadDependenciesFile = function(dir, file) {
  var path = NodeGoog.closureUtils_.getPath(dir, file);
  if (!NodeGoog.path_.existsSync(path)) { return; }
  this.loadScript_( dir, file, path );
};

/**
 * Loads additional closure.json files in the specified directory.
 *
 * @param {string} dir The directory holing the closure.json file.
 */
NodeGoog.prototype.loadAdditionalSettingsFile = function(dir) {
  var settings = NodeGoog.closureUtils_.readArgsFromJSONFile(
    NodeGoog.closureUtils_.getPath(dir, 'closure.json'));
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
 * @private
 * @suppress  {accessControls}
 */
NodeGoog.prototype.loadBaseScript_ = function() {
  var basePath = this.opts_.closureBasePath;
  this.loadScript_( basePath, 'base.js' );
  goog.global = goog.window = global.window = global.top = global;
  var that = this;
	goog.writeScriptTag_ = function( filename ) {
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
NodeGoog.prototype.loadScript_ = function(basedir, filename, path) {
  path = path || (filename.indexOf('/') === 0 ? filename :
    NodeGoog.closureUtils_.getPath(basedir, filename));

  if ( NodeGoog.scriptsWritten_[ path ] ) { return; }
  NodeGoog.scriptsWritten_[ path ] = 1;
  var code = NodeGoog.fs_.readFileSync( path, 'utf-8' ).replace(/^#!node/, '');
  NodeGoog.script_.runInThisContext.call( global, code , filename );

  this.scriptLoaded_();
};

/**
 * Every time a script is loaded we check here if any additional initialisation
 * is required to make the loaded mode function correctly.  Namely the testing
 * and timers framework need a bit of extra work to function correctly.
 *
 * @private
 */
NodeGoog.prototype.scriptLoaded_ = function() {
  // If we are using the testing framework lets initialise it.
  if (goog.testing && !global.require) {
    this.initialiseTestingFramework_();
  }
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
NodeGoog.prototype.loadGoogDeps_ = function() {
	this.loadScript_( this.opts_.closureBasePath, 'deps.js' );
};

/**
 * If the currently executed script has deps.js in its directory also load it
 * as it will contain some additional dependencies which may not be in the
 * additionaDeps declaration of the settings file.
 *
 * @private
 */
NodeGoog.prototype.loadCurrentScriptDeps_ = function() {
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
NodeGoog.prototype.loadAdditionalDeps_ = function() {
  this.loadAdditionalDepsImpl_(this.opts_);
};

/**
 * @private
 * @param {node_goog.opts} opts The options object which we will parse for
 *    additional deps.
 */
NodeGoog.prototype.loadAdditionalDepsImpl_ = function(opts) {
  if (!opts || !opts.additionalDeps) { return; }

  for (var i = 0, len = opts.additionalDeps.length; i < len; i++) {
    var fileName = opts.additionalDeps[i];
    var idx = fileName.lastIndexOf('/');
    this.loadScript_( fileName.substring(0, idx + 1),
      fileName.substring(idx + 1) , fileName);
  }
};

/**
 * When we detect testcase.js loaded we add a few hooks and hacks to ensure that
 *    the tests work as expected
 * @suppress  {accessControls}
 */
NodeGoog.prototype.initialiseTestingFramework_ = function() {
  global.require = require;
  global.navigator = {userAgent:'node.js'};

  // This can be used to set the specific test
  global.window.location = {
    search:'',
    href:''
  };

  var logElement = {};
  global.document = {
    title:'Node.js Google Closure Test Suite' ,
    write: function(str) { },
    getElementById: function(id) { return logElement; }
  };
  var that = this;
  setTimeout(function() { // Wait untill all files are loaded
    that.initialiseTestingFramework2_();
  }, 1);
};

/**
 * When we detect testcase.js loaded we add a few hooks and hacks to ensure that
 *    the tests work as expected
 * @suppress  {accessControls}
 */
NodeGoog.prototype.initialiseTestingFramework2_ = function() {
  if (typeof (goog.testing) !== 'undefined' &&
      typeof (goog.testing.TestRunner) !== 'undefined') {
    goog.testing.TestCase.prototype.countNumFilesLoaded_ =
      function() { return 0;  }
    goog.testing.TestRunner.prototype.onComplete_ =
      this.onTestComplete_;
  }
  // googtest.js manages its own test starting
  if (goog.testing.jsunit.AUTO_RUN_ONLOAD && window.onload) {
    window.onload();
  } else {
    this.onTestsReady();
  };
};

/**
 * Can be overriden to be notified when the test code has been initialised
 *
 * @type {function():undefined}
 */
NodeGoog.prototype.onTestsReady = function() {};

/**
 * @private
 * @type {function():undefined}
 */
NodeGoog.prototype.onTestComplete_ = function() {};

/**
 * Override to be notified when a TestCase is completed.
 * @param {function():undefined} funct The function that will be called when
 *    the tests are completed
 */
NodeGoog.prototype.setOnTestComplete = function(funct) {
  this.onTestComplete_ = funct;
};

exports.goog = new NodeGoog();