/*
 * Copyright 2011 Guido Tapia (guido@tapia.com.au).
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
 * @fileoverview This does 3 tasks.  It firstly detects sets up 2 interception
 * points intended for goog.js (or anyone else) to be notified of scripts
 * loaded or to veto the loading of a certain script.  Then it checks if we
 * are trying to run a closure jsunit test.  If we are then it kills the
 * current process and starts a new instance of googtest <filename>.
 *
 * If this is NOT a test then we minimaly initialise the closure framework.
 * This means that we just load the base.js file as specified in the
 * closureBasePath
 *
 * @author guido@tapia.com.au (Guido Tapia)
 */

if (typeof(goog) !== 'undefined'){
goog.provide('node_goog_googbase');
goog.require('node_goog_settingsLoader');
};

/**
 * @constructor
 */
node_goog_googbase = function() {
  /**
   * The settings loaded in the current context.
   * @type {node_goog_opts}
   */
  this.globalClosureSettings;


  /**
   * The path to closure library's goog directory where deps.js and base.js
   * reside
   * @type {string}
   */
  this.closureBasePath;

  /**
   * Stores a reference to the name of all the scripts loaded so we don't load
   * things twice.
   *
   * @private
   * @type {Object.<boolean>}
   */
  this.scriptsWritten_ = {};

  /**
   * @private
   * @type {node_goog_settingsLoader}
   */
  this.settingsLoader_ = require('./settingsloader').settingsLoader;

  /*
   * This snippet is the main 'brains' of this entire module.
   *
   * If the currently executing file (being interpreted by Node.js) is a test
   * file, we stop current execution and run the file using googtest.
   */
  if (this.isRunningTestingFile_()) {
    this.runCurrentFileInGoogTest_();
    this.killCurrentThread_();
  } else {
    this.loadBaseScript_();
    this.loadGoogDeps_();
    this.loadAllDependencies(this.globalClosureSettings);
  }
};

/**
  * If this method returns false then the loadScript funciton above will abort
  * the loading of a specified script. Intended to be shadowed by goog.js
  * @param {string} dir The directory where the file resides
  * @param {string} file The file to load
  */
node_goog_googbase.prototype.closureScriptLoading = function(dir, file) { return true; };

/**
  * Notification after a script is loaded. Intended to be shadowed by goog.js
  * @param {string} dir The directory where the file resides
  * @param {string} file The file to load
  */
node_goog_googbase.prototype.closureScriptLoaded = function(dir, file) { };

/**
  * @param {node_goog_opts} opts The settings object passed in to goog.init
  *    call which may contain some dependencies.
  */
node_goog_googbase.prototype.loadAllDependencies = function(opts) {
  this.loadAdditionalDepsInSettingsObject_(opts);
  this.loadCurrentScriptDeps_();
};



/**
  * Determines wether the currently running file, i.e. The file that is being
  * executed by the node.js interpreter is a test file or not.
  *
  * TODO [GT]: Is there a better way to determine if this is a test file, this
  * regex seems a little fragile?
  *
  * @return {boolean} Wether the currently running file is a testing file or not
  * @private
  */
node_goog_googbase.prototype.isRunningTestingFile_ = function() {
  var contents = require('fs').readFileSync(process.argv[1]).toString();
  return contents.toString().search(/\s*goog\s*\.\s*require\(\s*['"]goog\.testing\.jsunit['"]\)/g) >= 0;
};

/**
  * If the current file being executed is a test we actually stop processing and
  * start a new child process that runs this file using googtest
  * @private
  */
node_goog_googbase.prototype.runCurrentFileInGoogTest_ = function() {
  var command = 'googtest';
  var args = process.argv.splice(1);
  var test = require('child_process').spawn(command, args);
  var printMsg = function(data) {
    data = data.toString();
    if (data.charAt(data.length - 1) === '\n') {
      data = data.substring(0, data.length - 1);
    }
    console.error(data);
  };
  test.stdout.on('data', printMsg);
  test.stderr.on('data', printMsg);
  test.on('uncaughtException', function(err) {
    console.error(err.stack);
  })
};

/**
  * Kills the current thread (stops the Node session)
  * @private
  */
node_goog_googbase.prototype.killCurrentThread_ = function() {
  process.once('uncaughtException', function(ex) {});
  throw new Error();
};

/**
  * Loads the base script
  * @private
  */
node_goog_googbase.prototype.loadBaseScript_ = function() {
  this.globalClosureSettings = this.settingsLoader_.readSettingsObject();
  this.closureBasePath = this.resolveClosureBasePath_();
  this.loadBaseScriptImpl_();
};


/**
  * We can now load the Closure dependency tree.
  * @private
  */
node_goog_googbase.prototype.loadGoogDeps_ = function() {
  this.loadScript(this.closureBasePath, 'deps.js');
};

/**
  * Resolves the path to the goog directory in the closure library.  This
  * directory holds the deps.js and base.js file.
  * @return {string} The goog directory in the closure library.  This
  *    directory holds the deps.js and base.js file.
  * @private
  */
node_goog_googbase.prototype.resolveClosureBasePath_ = function() {
  return require('path').resolve(
    this.globalClosureSettings.closureBasePath, 'closure/goog');
};

/**
  * Loads the closure's base.js file which gets the running context into a
  * minimally initiated closure state.  We also update the following references:
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
node_goog_googbase.prototype.loadBaseScriptImpl_ = function() {
  this.loadScript(this.closureBasePath, 'base.js');
  goog.global = goog.window = global.window = global.top = global;
  var that = this;

  goog.writeScriptTag_ = function(filename) {
    that.loadScript(that.closureBasePath, filename);
    return false;
  };
};


/**
  * Loads a script into the current global context.
  *
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
  * @param {string} dir The directory where the file resides
  * @param {string} file The file to load
  * @private
  */
node_goog_googbase.prototype.loadScript = function(dir, file) {
  // Give goog.js a chance to stop the loading of certain scripts
  if (!this.closureScriptLoading(dir, file)) { return; }

  // TODO: Do we need absolute file support?
  var path = (file.indexOf('/') === 0 ? file :
    require('path').resolve(dir, file));

  if (this.scriptsWritten_[path]) { return; }
  this.scriptsWritten_[ path ] = true;

  var contents = require('fs').readFileSync(path).toString();
  try {
    process.binding('evals').Script.
      runInThisContext.call(global, contents, file);
  } catch (ex) {
    console.error('Could not run the following file: ' + path);
    throw ex;
  }
  // TODO: MOVE TO goog.js
  // Don't load goog's JSUnit hooks as we will handle all this stuff
  // in googtest.js
  // if (path.indexOf('testing/jsunit.js') >= 0) { return; }

  this.closureScriptLoaded(dir, file);
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
  * @private
  */
node_goog_googbase.prototype.loadDependenciesFile = function(dir, file) {
  var path = this.settingsLoader_.getPath(dir, file);
  if (!require('path').existsSync(path)) { return; }
  this.loadScript(dir, file);
};



/**
  * If the currently executed script has deps.js in its directory also load it
  * as it will contain some additional dependencies which may not be in the
  * additionalDeps declaration of the settings file.
  *
  * @private
  */
node_goog_googbase.prototype.loadCurrentScriptDeps_ = function() {
  var file = process.argv[1];
  var rp = require('fs').realpathSync(file);
  var depsPath = file.substring(0, file.lastIndexOf('/') + 1);
  this.loadDependenciesFile(depsPath, 'deps.js');
  this.loadDependenciesFile(__dirname, 'deps.js');
  this.loadDependenciesFile(__dirname, '../bin/deps.js');

};


/**
  * @private
  * @param {node_goog_opts} opts The options object which we will parse for
  *    additional deps.
  */
node_goog_googbase.prototype.loadAdditionalDepsInSettingsObject_ =
    function (opts) {
  if (!opts || !opts.additionalDeps) { return; }

  for (var i = 0, len = opts.additionalDeps.length; i < len; i++) {
    var fileName = opts.additionalDeps[i];
    var idx = fileName.lastIndexOf('/');
    this.loadScript(fileName.substring(0, idx + 1),
      fileName.substring(idx + 1));
  }
};

exports.googbase = new node_goog_googbase();