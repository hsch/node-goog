
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
 * We only read the settings object once and then it is cached to allow
 * for safe multiple calls of the goog.node.utils.readSettingObject method
 * below.
 *
 * @private
 * @type {node_goog.opts}
 */
goog.node.utils.cachedArgs_;


/**
 * @param {string} file The file to try to parse settings out of.  It is also
 *    used to determine which directory to look for the closure.json settings
 *    file.
 * @return {node_goog.opts} The correct options object in the current context.
 */
goog.node.utils.readSettingObject = function(file) {
  if (goog.node.utils.cachedArgs_) return goog.node.utils.cachedArgs_;

  var contents = file ? require('fs').readFileSync(file, encoding = 'utf8') :
      null;
  var fileSettings = contents ?
      goog.node.utils.parseCompilerArgsFromFile_(contents) : null;

  file = file || process.argv[1];
  var dirIdx = file.lastIndexOf('/');
  var dir = dirIdx > 0 ? file.substring(0, dirIdx) : '.';

  var codeDirSettings = goog.node.utils.readArgsFromJSONFile(dir +
      '/closure.json');
  var globalSettings = goog.node.utils.readArgsFromJSONFile(__dirname +
      '/closure.json');

  var settings = globalSettings || {};
  goog.node.utils.extendObject_(settings, codeDirSettings);
  goog.node.utils.extendObject_(settings, fileSettings);
  return goog.node.utils.cachedArgs_ = settings;
};


/**
 * @param {string} file The settings (JSON) file to read.
 * @return {node_goog.opts} The options object represented in the
 *    specified file.
 */
goog.node.utils.readArgsFromJSONFile = function(file) {
  try {
    var json = require('fs').readFileSync(file,
        encoding = 'utf8');
    return goog.node.utils.getOptsObject_(json);
  } catch (ex) {
    return null;
  }
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
  return opts;
};


/**
 * @type {goog.node.utils}
 */
exports.closureUtils = goog.node.utils;
