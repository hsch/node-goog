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
 *
 * @see README.md
 * @author Hendrik Schnepel (hendrik.schnepel@gmail.com)
 * @author Guido Tapia (guido@tapia.com.au)
 */

/**
 * As soon as the module is loaded we initialise the 'closure' framework so we
 * can start using goog.provide, etc straight away.
 *
 * Note this require will actually load 3 types:
 * - node_goog_googbase
 * - node_goog_settingsLoader
 * - node_goog_opts
 * All these 3 types are in existance before closure is initialised and
 * hence cannot be properly namespaced.
 *
 * @type {node_goog_googbase}
 * @private
 */
var googbase_ = require('./googbase').googbase;

// TODO: node_goog_interceptGoogRequires_ should live inside googbase
node_goog_interceptGoogRequires_();

goog.provide('node.goog');

goog.require('goog.string');
goog.require('goog.Timer');
goog.require('node_goog_opts');
goog.require('node_goog_googbase');
goog.require('node_goog_settingsLoader');

// TODO: Do we need this line anymore?
global.require = require;

/**
 * @constructor
 */
node.goog = function() {

  /**
   * @private
   * @type {node_goog_settingsLoader}
   */
  this.settingsLoader_ = /** @type {node_goog_settingsLoader} */
    (require('./settingsloader').settingsLoader);


  /**
   * These are the settings being currently used.
   * @type {node_goog_opts}
   */
  this.args;

  /**
   * This is the context used to inject all 'requires', if null we will
   *    use global (more efficient).
   * @type {Object}
   * @private
   */
  this.ctx_;

  /**
   * @private
   * @type {boolean}
   */
  this.initialised_ = false;

  /**
   * Sets a global 'node.goog.instance' poiting to 'this' which is the main
   * 'goog' context.  This allows anyone (especially googtest) to
   * load any additional dependencies if required
   * @type {node.goog}
   */
  node.goog.instance = this;
};

/**
 * A global 'node.goog.instance' poiting to 'this' which is the main
 * 'goog' context.  This allows anyone (especially googtest) to
 * load any additional dependencies if required
 *
 * @type {node.goog}
 */
node.goog.instance;

/**
 * @param {string} dir The base directory of the specified file.
 * @param {string} file This is the file (or directory) name which needs to
 *    be concatenated to the baseDir.
 * @return {string} The correctly concatenated baseDir + file which should
 *    represent the full path to the specific file/dir.
 */
node.goog.prototype.getPath = function(dir, file) {
    return this.settingsLoader_.getPath(dir, file);
};

/**
 * @param {node_goog_opts=} opts Parameters object
 * @return {node.goog}
 */
node.goog.prototype.init = function(opts) {
  // Any class brought in by using goog.require will not have access to
  // anonymous vars in the global context so lets make them implicit.
  global.__dirname = __dirname;
  global.__filename = __filename;

  // If we are calling init again inside another context like a test then we
  // do not have to go through the full initialisation but we do need to
  // load some settings just in case the test loads additional dependencies
  this.args = this.settingsLoader_.readSettingsObject(opts);

  if (this.initialised_) {
    if (opts) { this.loadAditionalDependenciesInSettings_(this.args); }
    return this;
  }
  this.initialised_ = true;
  this.loadAditionalDependenciesInSettings_(this.args);
  return this; // Allows some 'fluent' style usage
};

/**
 * This function executes the specified file in its own context and intercepts
 * any calls to goog.init to try to capture any additional settings objects.
 *
 * @param {string} file  The file to execute and intercept the goog.init
 *  call
 * @return {node_goog_opts?} The options object represented in the
 *    specified file
 */
node.goog.prototype.parseCompilerArgsFromFile = function(file) {
  return this.settingsLoader_.parseCompilerArgsFromFile(file);
};

/**
 * @private
 * Loads all additional dependencies file found in the settings object.
 * @param {node_goog_opts} opts
 */
node.goog.prototype.loadAditionalDependenciesInSettings_ = function(opts) {
  googbase_.loadAllDependencies(opts);
};

/**
 * Sets a new context which will load all subsequent requires into this
 * context.  Note: The plan for this was to load each test in its own
 * context but this did not completed.
 *
 * @param {Object} ctx The context used to inject all 'requires'.
 */
node.goog.prototype.setCurrentContext = function(ctx) { this.ctx_ = ctx; };

/**
 * @private
 */
node.goog.prototype.setNamespaceIn_ = function(target, value, namespace) {
  var ns = namespace.split('.');

  for (var i = 0, len = ns.length, curr; curr = ns[i++];) {
    var val = i === len ? value : (target[curr] || {});
    target = target[curr] = val;

  }
};


////////////////////////////////////////////////////////////////////////////////
// Shadow googbase.js closureScriptLoading and closureScriptLoaded
////////////////////////////////////////////////////////////////////////////////


/**
 * If this method returns false then the loadScript_ funciton in googbase.js
 * will abort the loading of a specified script.
 *
 * Allows the loading of all scripts except goog.testing.jsunit which we
 * handle in googtest.js
 *
 * @param {string} dir The directory where the file resides
 * @param {string} file The file to load
 */
googbase_.closureScriptLoading = function(dir, file) {
  return (file.indexOf('testing/jsunit.js') < 0);
}

/**
 * Notification after a script is loaded by googbase.js.
 *
 * Every time a script is loaded we check here if any additional initialisation
 * is required to make the loaded mode function correctly.  Namely the timers
 * framework need a bit of extra work to function correctly.
 *
 * @param {string} dir The directory where the file resides
 * @param {string} file The file to load
 */
googbase_.closureScriptLoaded = function(dir, file) {
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
}


// TODO: Change this to exports.init = new node.goog().init
// This will remove an intermediate step that is totally redundant
exports.goog = new node.goog();

////////////////////////////////////////////////////////////////////////////////
// node_goog_interceptGoogRequires_
////////////////////////////////////////////////////////////////////////////////

/**
 * This function allows other classes to use goog.require and pass in Node
 * modules that will be pumped into the global scope of the executing module.
 */
function node_goog_interceptGoogRequires_() {
  var nodeRequire = require;
  var googRequire = goog.require;
  var that = this;
  goog.require = function intercept(namespace){
    // If tests are requiring 'goog' then lets load the test additionalDeps if
    // any specified.  Otherwise ignore the call to require('goog') as we are
    // already initialised
    if (namespace === 'goog') { return { goog: that }; }
    // Ignore these 'herlper' classes which are not infact proper closure
    // classes as they exists before closure (base.js) has been loaded.
    // This means they must be called manually using node's require().
    // If anyone is the using goog.require() for these types its only
    // to get a bit of compiler support
    else if (namespace.indexOf('node_goog_') === 0) { return; }
    else if (namespace.indexOf('.') < 0) { // Assume no namespace == node.js core
      (that.ctx_ || global)[namespace] = nodeRequire(namespace);
    } else {
      googRequire(namespace);
      if (that.ctx_) {
        var obj = goog.getObjectByName(namespace);
        that.setNamespaceIn_(that.ctx_, obj, namespace)
      }
    }
  };
};