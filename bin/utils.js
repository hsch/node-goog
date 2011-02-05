
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
  goog.provide('node.goog.utils');
} else {
  global['node'] = global['node'] || {goog: {utils: {}}};
  global['node'].goog = global['node'].goog || {};
  global['node']['goog'].utils = global['node']['goog'].utils || {};

}


/**
 * @private
 * @type {extern_fs}
 */
node.goog.utils.fs_ = /** @type {extern_fs} */ (require('fs'));


/**
 * @private
 * @type {extern_path}
 */
node.goog.utils.path_ = /** @type {extern_path} */ (require('path'));


/**
 * @param {string=} file The file to try to parse settings out of.  It is also
 *    used to determine which directory to look for the closure.json settings
 *    file.
 * @return {node.goog.opts?} The correct options object in the current context.
 */
node.goog.utils.readSettingObject = function(file) {
  var contents = null, fileSettings = null;
  if (file) {
    contents = node.goog.utils.fs_.readFileSync(file, encoding = 'utf8');
    fileSettings = node.goog.utils.parseCompilerArgsFromFile_(file, contents);
  }

  var globalSettings =
      node.goog.utils.readArgsFromJSONFile(__dirname,
      node.goog.utils.getPath(__dirname, '/closure.json'));
  var codeDirSettings = node.goog.utils.readArgsFromSourceDir_(file);
  var currentDirSettings =
      node.goog.utils.readArgsFromJSONFile(process.cwd(),
      node.goog.utils.getPath(process.cwd(), '/closure.json'));

  var settings = globalSettings || /** @type {!node.goog.opts} */ ({});
  node.goog.utils.extendObject_(settings, codeDirSettings);
  node.goog.utils.extendObject_(settings, currentDirSettings);
  node.goog.utils.extendObject_(settings, fileSettings);
  return node.goog.utils.validateOpsObject_(null, settings, false);
};


/**
 * @private
 * @param {string=} file The file currently being executed.
 * @return {node.goog.opts?} The options object represented in the
 *    specified file.
 */
node.goog.utils.readArgsFromSourceDir_ = function(file) {
  if (!file) {
    file = process.argv[1];
    if (file.indexOf('googcompile') >= 0 ||
        file.indexOf('googdoc') >= 0 ||
        file.indexOf('googtest') >= 0 ||
        file.indexOf('googcodecheck') >= 0) {
      file = process.argv[2];
    }
  }
  var dirIdx = file.lastIndexOf('/');
  var dir = dirIdx > 0 ? file.substring(0, dirIdx) : '.';

  return node.goog.utils.readArgsFromJSONFile(
      dir, node.goog.utils.getPath(dir, '/closure.json'));
};


/**
 * @param {string} baseDir The base directory of the specified file.
 * @param {string} file This is the file (or directory) name which needs to
 *    be concatenated to the baseDir.
 * @return {string} The correctly concatenated baseDir + file which should
 *    represent the full path to the specific file/dir.
 */
node.goog.utils.getPath = function(baseDir, file) {
  if (baseDir.charAt(baseDir.length - 1) !== '/') baseDir += '/';
  if (file.charAt(0) === '/') file = file.substring(1);
  return baseDir + file;
};


/**
 * @param {string} currentDir The directory of the current settings file or
 *    executing javascript file.
 * @param {string} file The settings (JSON) file to read.
 * @return {node.goog.opts?} The options object represented in the
 *    specified file.
 */
node.goog.utils.readArgsFromJSONFile = function(currentDir, file) {
  if (!node.goog.utils.path_.existsSync(file)) return null;
  var json = node.goog.utils.fs_.readFileSync(file,
      encoding = 'utf8');
  return node.goog.utils.getOptsObject_(currentDir, json);
};


/**
 * @private
 * @param {Object} target The object to extend.
 * @param {Object} newData The data to add or replace in the target object.
 * @return {Object} The modified target object.
 */
node.goog.utils.extendObject_ = function(target, newData) {
  if (!newData) { return target; }
  for (var i in newData) {
    var orig = target[i];
    var newprop = newData[i];
    if (orig && newprop && typeof(newprop) !== 'string' &&
        typeof (newprop.length) === 'number') {
      for (var i = 0, len = newprop.length; i < len; i++) {
        orig.push(newprop[i]);
      }
    } else {
      target[i] = newprop;
    }
  }
  return target;
};


/**
 * @private
 * @param {string} file The file to try to parse settings out of.  It is also
 *    used to determine which directory to look for the closure.json settings
 *    file.
 * @param {string} code The javascript code to parse trying to find the
 *    settings object.
 * @return {node.goog.opts?} The options object represented in the
 *    specified javascript code.
 */
node.goog.utils.parseCompilerArgsFromFile_ = function(file, code) {
  var regex =
      /var\s+([\w\d^=\s]+)\s*=\s*require\(\s*['"]goog['"]\s*\)\s*\.\s*goog/gm;
  var m = regex.exec(code);
  var err = 'Could not find a call to goog.init in the specified file.';
  if (!m) return null;
  var varName = m[1].trim();
  var regespStr = varName + '\\s*\\.\\s*init\\s*\\(\\s*({[^}]*})';
  regex = new RegExp(regespStr, 'gm');
  m = regex.exec(code);
  if (!m) return null;
  var optsString = m[1];
  var dir = file.substring(0, file.lastIndexOf('/'));

  return node.goog.utils.getOptsObject_(dir, optsString);
};


/**
 * @private
 * @param {string} currentDir The directory of the current settings file or
 *    executing javascript file.
 * @param {string} optsString JSON string representation of an options object.
 * @return {node.goog.opts} The options object.
 */
node.goog.utils.getOptsObject_ = function(currentDir, optsString) {
  process.binding('evals').Script.runInThisContext('var opts = ' + optsString);
  if (!opts) {
    throw new Error('Could not create an options object from ' +
        'the specified string');
  }
  return node.goog.utils.validateOpsObject_(currentDir, opts, true);
};


/**
 * @private
 * @param {string?} currentDir The directory of the current settings file or
 *    executing javascript file.
 * @param {!node.goog.opts} opts The options object to validate.
 * @param {boolean} allowNullMandatories Wether to allow null mandatory
 *    directories.
 * @return {!node.goog.opts} The validated options object.
 */
node.goog.utils.validateOpsObject_ =
    function(currentDir, opts, allowNullMandatories) {
  if (opts.closureBasePath)
    opts.closureBasePath = node.goog.utils.validateDir_(currentDir,
        'closureBasePath', opts.closureBasePath, allowNullMandatories);
  if (opts.jsdocToolkitDir)
    opts.jsdocToolkitDir = node.goog.utils.validateDir_(currentDir,
        'jsdocToolkitDir', opts.jsdocToolkitDir, true);
  if (opts.nodeDir)
    opts.nodeDir = node.goog.utils.validateDir_(currentDir,
        'nodeDir', opts.nodeDir, true);
  if (opts.compiler_jar)
    opts.compiler_jar = node.goog.utils.validateDir_(currentDir,
        'compiler_jar', opts.compiler_jar, true);
  if (opts.additionalDeps) {
    for (var i = 0, len = opts.additionalDeps.length; i < len; i++) {
      opts.additionalDeps[i] = node.goog.utils.validateDir_(currentDir,
          'additionalDeps', opts.additionalDeps[i], true);
    }
  }
  if (opts.additionalCompileRoots) {
    for (var i = 0, len = opts.additionalCompileRoots.length; i < len; i++) {
      opts.additionalCompileRoots[i] = node.goog.utils.validateDir_(
          currentDir, 'additionalCompileRoots',
          opts.additionalCompileRoots[i], true);
    }
  }
  return opts;
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
node.goog.utils.validateDir_ = function(currentDir, name, dir, allowNull) {
  if (!dir) {
    if (allowNull) return dir;
    throw new Error('Directory/File: ' + name + ' must be specified.');
  }
  if (dir.charAt(0) !== '/' && dir.charAt(0) !== '\\' && currentDir) {
    dir = node.goog.utils.getPath(currentDir, dir);
  }
  if (!node.goog.utils.checkDirExists_(dir)) {
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
node.goog.utils.checkDirExists_ = function(dir) {
  return node.goog.utils.path_.existsSync(dir);
};


/**
 * @typedef {{closureBasePath:string,
 *    additionalDeps:Array.<string>,
 *    jsdocToolkitDir:string,
 *    nodeDir:string,
 *    compiler_jar:string,
 *    additionalCompileOptions:Array.<string>,
 *    additionalCompileRoots:Array.<string>}}
 */
node.goog.opts;


/** @type {Object} */
exports.closureUtils = node.goog.utils;
