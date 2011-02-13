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
 *
 * This file is used by lib/goog.js and cannot be a closure provided file.
 */

/**
 * @fileoverview This file contains utilties that are required by the utils
 * in node-goog project.  The files using this include googdoc.js,
 * googcodecheck.js and googcompile.js in this directory and lib/goog.js.
 *
 * Since lib/goog.js is loaded without the closure scope set this file must
 * support running outside of closure scope.
 *
 * @author guido@tapia.com.au (Guido Tapia)
 */

if (typeof(goog) !== 'undefined') {
goog.provide('node_goog_settingsLoader');
goog.provide('node_goog_opts');
};

/**
 * @constructor
 */
var node_goog_settingsLoader = function() {
  /**
   * @private
   * @type {node_goog_opts}
   */
  this.cached_opts_;
};

/**
 * @param {string} baseDir The base directory of the specified file.
 * @param {string} file This is the file (or directory) name which needs to
 *    be concatenated to the baseDir.
 * @return {string} The correctly concatenated baseDir + file which should
 *    represent the full path to the specific file/dir.
 */
node_goog_settingsLoader.prototype.getPath = function(baseDir, file) {
  if (baseDir.charAt(baseDir.length - 1) !== '/') baseDir += '/';
  if (file.charAt(0) === '/') file = file.substring(1);
  return baseDir + file;
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
node_goog_settingsLoader.prototype.parseCompilerArgsFromFile = function(file) {
  var contents = require('fs').readFileSync(file).toString();
  return this.parseCompilerArgsFromFileImpl_(file, contents);
};


/**
 * @param {string} path The closure.json file that holds the description of the
 *   settings.
 *
 * @return {node_goog_opts?} The settings object
 */
node_goog_settingsLoader.prototype.readArgsFromJSONFile = function(path) {
  if (!path || !require('path').existsSync(path)) return null;
  var json = require('fs').readFileSync(path).toString();
  var dir = path.substring(0, path.lastIndexOf('/'));
  return this.getOptsObject_(dir, json);
};


/**
 * This method reads the settings object in the current directory, global
 * directory and finaly if we pass in the optional opts parameter
 * we also include that in the settings.  This method is safe and efficient
 * to call multiple times.
 *
 * @param {node_goog_opts=} opts The base options object to use.  This is
 *     used by goog.js and it passes in the init(opts) object
 * @return {node_goog_opts} The options object in the current context.
 */
node_goog_settingsLoader.prototype.readSettingsObject = function(opts) {
  if (this.cached_opts_) {
    if (opts) {
      this.cached_opts_ =
        this.validateOpsObject_(null,
          this.extendObject_(this.cached_opts_, opts),
          false);
    }
    return this.cached_opts_;
  }

  var globalSettings =
      this.readArgsFromJSONFile(this.getPath(__dirname, '../bin/closure.json'));
  var currentDirSettings =
      this.readArgsFromJSONFile(this.getPath(process.cwd(), '/closure.json'));
  var settings = globalSettings || /** @type {!node_goog_opts} */ ({});
  this.extendObject_(settings, currentDirSettings);
  if (opts) this.extendObject_(settings, opts);
  return this.cached_opts_ =
      this.validateOpsObject_(null, settings, false);
};

/**
 * @private
 * @param {node_goog_opts} target The object to extend.
 * @param {node_goog_opts?} newData The data to add or replace in the target object.
 * @return {node_goog_opts} The modified target object.
 */
node_goog_settingsLoader.prototype.extendObject_ = function(target, newData) {
  if (!newData) { return target; }
  for (var i in newData) {
    var orig = target[i];
    var newprop = newData[i];
    if (orig && newprop && typeof(newprop) !== 'string' &&
        typeof (newprop.length) === 'number') {
      for (var i = 0, len = newprop.length; i < len; i++) {
        if (!this.arrayContains_(orig, newprop[i])) {
          orig.push(newprop[i]);
        }
      }
    } else {
      target[i] = newprop;
    }
  }
  return target;
};

/**
 * @private
 * @param {Array} arr The array to check.
 * @param {*} o The value to check for in the specified array.  Note this uses
 *    === comparison so only ref matches are found.
 * @return {boolean} Wether the specified array contains the specified value.
 */
node_goog_settingsLoader.prototype.arrayContains_ = function(arr, o) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === o) return true;
  }
  return false;
};

/**
 * @private
 * @param {string} file The file to try to parse settings out of.  It is also
 *    used to determine which directory to look for the closure.json settings
 *    file.
 * @param {string} code The javascript code to parse trying to find the
 *    settings object.
 * @return {node_goog_opts?} The options object represented in the
 *    specified javascript code.
 */
node_goog_settingsLoader.prototype.parseCompilerArgsFromFileImpl_ =
    function(file, code) {
  var opts;
  var ctx = {
    require: function(moduleName) {
      return {
        goog: {
          init: function(innerOpts) {
            opts = innerOpts;
            throw new Error('intentional exit');
          }
        }
      };
    }
  };
  code = code.replace(/^#![^\n]+/, '\n');
  try { process.binding('evals').Script.runInNewContext(code, ctx, file); }
  catch (e) {}
  var dirIdx = file.lastIndexOf('/');
  var dir = dirIdx < 0 ? '.' : file.substring(0, dirIdx);
  return this.validateOpsObject_(
      this.getPath(process.cwd(), dir), opts || {}, true);
};


/**
 * @private
 * @param {string?} dir The directory of the current settings file or
 *    executing javascript file.
 * @param {string} json JSON string representation of an options object.
 * @return {node_goog_opts} The options object.
 */
node_goog_settingsLoader.prototype.getOptsObject_  = function(dir, json) {
  process.binding('evals').Script.runInThisContext('var opts = ' + json);
  return this.validateOpsObject_(dir, opts, true);
};


/**
 * @private
 * @param {string?} currentDir The directory of the current settings file or
 *    executing javascript file.
 * @param {!node_goog_opts} opts The options object to validate.
 * @param {boolean} allowNullMandatories Wether to allow null mandatory
 *    directories.
 * @return {!node_goog_opts} The validated options object.
 */
node_goog_settingsLoader.prototype.validateOpsObject_ = function(currentDir, opts, allowNullMandatories) {
  if (opts.closureBasePath) {
    opts.closureBasePath = this.parseClosureBasePath_(
        this.validateDir_(currentDir,
        'closureBasePath', opts.closureBasePath, allowNullMandatories));
  } if (opts.jsdocToolkitDir) {
    opts.jsdocToolkitDir = this.validateDir_(currentDir,
        'jsdocToolkitDir', opts.jsdocToolkitDir, true);
  } if (opts.nodeDir) {
    opts.nodeDir = this.validateDir_(currentDir,
        'nodeDir', opts.nodeDir, true);
  } if (opts.compiler_jar) {
    opts.compiler_jar = this.validateDir_(currentDir,
        'compiler_jar', opts.compiler_jar, true);
  } if (opts.additionalDeps) {
    for (var i = 0, len = opts.additionalDeps.length; i < len; i++) {
      opts.additionalDeps[i] = this.validateDir_(currentDir,
          'additionalDeps', opts.additionalDeps[i], true);
    }
  } if (opts.additionalCompileRoots) {
    for (var i = 0, len = opts.additionalCompileRoots.length; i < len; i++) {
      opts.additionalCompileRoots[i] = this.validateDir_(
          currentDir, 'additionalCompileRoots',
          opts.additionalCompileRoots[i], true);
    }
  }
  return opts;
};


/**
 * @private
 * @param {string} dir The directory specified as the closure base path.
 *    This allows any directory below or including the closure-library/
 *    directory.
 * @return {string} The /closure-library directory.
 */
node_goog_settingsLoader.prototype.parseClosureBasePath_ = function(dir) {
  var tokens = dir.split(/[\/\\]/);
  var pathToClosure = [];
  for (var i = 0, len = tokens.length; i < len; i++) {
    var t = tokens[i];
    if (t === '..') {
      pathToClosure.pop();
      continue;
    }
    pathToClosure.push(t);
    if (t.toLowerCase() === 'closure-library') { break; }
  }
  var path = require('path').normalize(pathToClosure.join('/'));
  return path;
};


/**
 * @private
 * @param {string?} currentDir The directory of the current settings file or
 *    executing javascript file.
 * @param {string} name The name or description of the directory.
 * @param {string} dir The directory to validate.
 * @param {boolean} allowNull Wether we can have null.
 * @return {string} The valid directory (turned into absolute).
 */
node_goog_settingsLoader.prototype.validateDir_ = function(currentDir, name, dir, allowNull) {
  if (!dir) {
    if (allowNull) return dir;
    throw new Error('Directory/File: ' + name + ' must be specified.');
  }
  if (dir.charAt(0) !== '/' && dir.charAt(0) !== '\\' && currentDir) {
    dir = this.getPath(currentDir, dir);
  }
  dir = require('path').normalize(dir);
  if (!this.checkDirExists_(dir)) {
    throw new Error('The directories/files specified in node-goog ' +
        'configuration could not be found: ' + dir);
  }
  return dir;
};


/**
 * @private
 * @param {string} dir The directory to check wether exists.
 * @return {boolean} Wether the specified directory exists.
 */
node_goog_settingsLoader.prototype.checkDirExists_ = function(dir) {
  return require('path').existsSync(dir);
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
var node_goog_opts;

exports.settingsLoader = new node_goog_settingsLoader();