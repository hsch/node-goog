
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
var goog = {node: {utils: {}}};

/**
 * @private
 * @type {extern_fs}
 */
goog.node.utils.fs_ = require('fs');

/**
 * @private
 * @type {extern_path}
 */
goog.node.utils.path_ = require('path');

/**
 * @param {string} file The file to try to parse settings out of.  It is also
 *    used to determine which directory to look for the closure.json settings
 *    file.
 * @return {node_goog.opts} The correct options object in the current context.
 */
goog.node.utils.readSettingObject = function(file) {
  var contents = file ? 
      goog.node.utils.fs_.readFileSync(file, encoding = 'utf8') : null;
  var fileSettings = contents ?
      goog.node.utils.parseCompilerArgsFromFile_(contents) : null;
       
  var globalSettings = 
    goog.node.utils.readArgsFromJSONFile(__dirname + '/closure.json');     
  var codeDirSettings = goog.node.utils.readArgsFromSourceDir_(file);  
  var currentDirSettings = 
    goog.node.utils.readArgsFromJSONFile(process.cwd() + '/closure.json');
    
  var settings = globalSettings || {};  
  goog.node.utils.extendObject_(settings, codeDirSettings);
  goog.node.utils.extendObject_(settings, currentDirSettings);
  goog.node.utils.extendObject_(settings, fileSettings);  
    
  return goog.node.utils.validateOpsObject_(settings, false);
};

/**
 * @param {string} file The file currently being executed.
 * @return {node_goog.opts} The options object represented in the
 *    specified file.
 */
goog.node.utils.readArgsFromSourceDir_ = function(file) {
  if (!file) {
    file = process.argv[1];
    if (file.indexOf('googcompile') >= 0 || 
          file.indexOf('googdoc') >= 0 || 
          file.indexOf('googtest') >= 0) {
      file = process.argv[2];
    }
  }  
  var dirIdx = file.lastIndexOf('/');
  var dir = dirIdx > 0 ? file.substring(0, dirIdx) : '.';
  
  return goog.node.utils.readArgsFromJSONFile(dir + '/closure.json');
}

/**
 * @param {string} file The settings (JSON) file to read.
 * @return {node_goog.opts} The options object represented in the
 *    specified file.
 */
goog.node.utils.readArgsFromJSONFile = function(file) {
  if (!goog.node.utils.path_.existsSync(file)) return null;
  var json = goog.node.utils.fs_.readFileSync(file,
      encoding = 'utf8');
  return goog.node.utils.getOptsObject_(json);  
};


/**
 * @private
 * @param {Object} target The object to extend.
 * @param {Object} newData The data to add or replace in the target object.
 * @return {Object} The modified target object.
 */
goog.node.utils.extendObject_ = function(target, newData) {
  if (!newData) { return target; }
  for (var i in newData) { target[i] = newData[i]; }
  return target;
};


/**
 * @private
 * @param {string} code The javascript code to parse trying to find the
 *    settings object.
 * @return {node_goog.opts} The options object represented in the
 *    specified javascript code.
 */
goog.node.utils.parseCompilerArgsFromFile_ = function(code) {
  var regex =
      /var\s+([\w\d^=\s]+)\s*=\s*require\(\s*['"]goog['"]\s*\)\s*\.\s*goog/gm;
  var m = regex.exec(code);
  var err = 'Could not find a call to goog.init in the specified file.';
  if (!m) return null;
  var varName = m[1].trim();
  var regespStr = varName + '\\s*\\.\\s*init\\s*\\(\\s*({[^}]*})';
  regex = new RegExp(regespStr, 'gm');
  var m = regex.exec(code);
  if (!m) return null;
  var optsString = m[1];
  return goog.node.utils.getOptsObject_(optsString);
};


/**
 * @private
 * @param {string} optsString JSON string representation of an options object.
 * @return {node_goog.opts} The options object.
 */
goog.node.utils.getOptsObject_ = function(optsString) {
  process.binding('evals').Script.runInThisContext('var opts = ' + optsString);
  if (!opts) throw new Error(err);
  return goog.node.utils.validateOpsObject_(opts, true);  
};

/**
 * @private
 * @param {!node_goog.opts} opts The options object to validate.
 * @param {boolean} allowNullMandatories Wether to allow null mandatory directories
 * @return {!node_goog.opts} The validated options object.
 */
goog.node.utils.validateOpsObject_ = function(opts, allowNullMandatories) {
  goog.node.utils.validateDir_('closureBasePath', opts.closureBasePath, allowNullMandatories);
  goog.node.utils.validateDir_('jsdocToolkitDir', opts.jsdocToolkitDir, true);
  goog.node.utils.validateDir_('nodeDir', opts.nodeDir, true);
  if (opts.additionalDeps) {
    for (var i = 0, len = opts.additionalDeps.length; i < len; i++) {
      goog.node.utils.validateDir_('additionalDeps', opts.additionalDeps[i], true);
    }
  };  
  return opts;
};

/**
 * @private
 * @param {string} name The name or description of the directory
 * @param {string} dir The directory to validate
 * @param {boolean} allowNull Wether we can have null
 */
goog.node.utils.validateDir_ = function(name, dir, allowNull) {
  if (!dir) {
    if (allowNull) return;
    throw new Error('Directory/File: ' + name + ' must be specified.');
  }
  if (dir.charAt(0) !== '/' && dir.charAt(0) !== '\\') {
    throw new Error('All directories/files specified in node-goog ' +
      'configuration must be absolute: ' + dir);
  };
  if (!goog.node.utils.path_.existsSync(dir)) {
    throw new Error('The directories/files specified in node-goog ' +
      'configuration could not be found: ' + dir);
  };
}
 
/**
 * @type {goog.node.utils}
 */
exports.closureUtils = goog.node.utils;