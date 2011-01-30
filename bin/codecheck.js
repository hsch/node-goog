# !node;

/**
 * @fileoverview Copyright 2011 Guido Tapia (guido@tapia.com.au).
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

require('goog').goog.init();

goog.provide('node.goog.codecheck');

goog.require('goog.array');



/**
 * @constructor
 */
node.goog.codecheck = function() {
  var dir = process.argv[2];
  if (!node.goog.codecheck.fs_.statSync(dir).isDirectory()) {
    dir = dir.substring(0, dir.lastIndexOf('/') + 1);
  }
  console.log ('codecheck: ' + dir);
  var that = this;
  this.runFixStyle_(dir, function() {
    //that.runGSJLint_(dir);
  });
};


/**
 * @private
 * @const
 * @type {extern_fs}
 */
node.goog.codecheck.fs_ = /** @type {extern_fs} */ (require('fs'));


/**
 * @private
 * @param {string} dir The directory to code check.
 * @param {function():undefined} callback The exit callback.
 */
node.goog.codecheck.prototype.runFixStyle_ = function(dir, callback) {
  console.log('runFixStyle_');
  var excludes = [];//this.getLinterExcludeFiles_(dir);
  console.dir(excludes);
  //console.log('ARGS: -x ' + excludes.join(','));
  //this.runProcess_('fixjsstyle', ['--strict', '-r', dir], callback);
};


/**
 * @private
 * @param {string} dir The directory to code check.
 * @param {function():undefined} callback The exit callback.
 */
node.goog.codecheck.prototype.runGSJLint_ = function(dir, callback) {
  var excludes = [];//this.getLinterExcludeFiles_(dir);
  this.runProcess_('gjslint', ['--strict', '-x ' + excludes.join(','), '-r', dir], callback);
};


/**
 * @private
 * @param {string} dir The directory to code check.
 * @return {Array.<string>} An array of all files to ignore.
 */
node.goog.codecheck.prototype.getLinterExcludeFiles_ = function(dir) {
  var excludes = goog.array.filter(node.goog.codecheck.fs_.readdirSync(dir),
      function(f) {
        return f.indexOf('.min.js') >= 0 &&
           f.indexOf('.tmp.js') >= 0 &&
           f.indexOf('_') === 0 &&
           f.indexOf('deps.js') >= 0;
      });
  console.dir(excludes);
  return excludes;
};


/**
 * @private
 * @param {string} command The command to execute.
 * @param {Array.<string>} args The arguments to pass to the command.
 * @param {function():undefined} callback The exit callback.
 */
node.goog.codecheck.prototype.runProcess_ = function(command, args, callback) {
  var cmd = require('child_process').spawn(command, args);

  var output = '', err = '';
  cmd.stdout.on('data', function(data) { output += data; });
  cmd.stderr.on('data', function(data) { err += data; });

  cmd.on('uncaughtException', function(err) {
    if (callback) callback();
    throw err;
  });

  cmd.on('exit', function(code) {
    if (callback) callback();


    console.log('\nSuccessfully executed ' + command +
        (code ? '\n\tcode:' + code : '') +
        (err ? '\n\tstderr:' + err : '') +
        '\n\tstdout: ' + output);
  });
};

new node.goog.codecheck();
