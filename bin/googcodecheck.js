#!/usr/local/bin/node

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

goog.provide('node.goog.googcodecheck');

goog.require('goog.array');
goog.require('node.goog.utils');



/**
 * @constructor
 */
node.goog.googcodecheck = function() {
  var dir = process.argv[2];
  var isDir = node.goog.googcodecheck.isDir_(dir);
  if (!isDir) {
    dir = dir.substring(0, dir.lastIndexOf('/') + 1);
  }
  var that = this;
  var onexit = function(err) {
    that.fixBashInstructionsOnDir_.call(that, dir);
    if (err) { console.error(err.stack); }
  };
  process.on('exit', onexit);
  process.on('SIGINT', onexit);
  process.on('uncaughtException', onexit);

  this.runFixStyle_(dir, function() {
    that.runGSJLint_(dir);
  });
};


/**
 * @private
 * @const
 * @type {extern_fs}
 */
node.goog.googcodecheck.fs_ = /** @type {extern_fs} */ (require('fs'));


/**
 * @private
 * @param {string} f The file or directory path.
 * @return {boolean} Wether the specified path is a directory.
 */
node.goog.googcodecheck.isDir_ = function(f) {
  return node.goog.googcodecheck.fs_.statSync(f)['isDirectory']();
};


/**
 * @private
 * @param {string} dir The directory to recursively fix the bash instructions
 *    on.
 */
node.goog.googcodecheck.prototype.fixBashInstructionsOnDir_ = function(dir) {
  goog.array.forEach(node.goog.googcodecheck.fs_.readdirSync(dir),
      function(f) {
        var path = node.goog.utils.getPath(dir, f);
        if (node.goog.googcodecheck.isDir_(path)) {
          return this.fixBashInstructionsOnDir_(path);
        }
        this.fixBashInstructions_(dir, f);
      }, this);
};


/**
 * @private
 * @param {string} dir The directory to code check.
 * @param {string} file The file to check.
 */
node.goog.googcodecheck.prototype.fixBashInstructions_ = function(dir, file) {
  if (this.isIgnorableFile_(dir, file)) return;
  var fileContents = node.goog.googcodecheck.fs_.
      readFileSync(node.goog.utils.getPath(dir, file), encoding = 'utf8');
  var m = /^# !([^;]+)\;/g.exec(fileContents);
  if (!m) { return; }
  var fixed = m[1].replace(/ /g, '');
  fileContents = fileContents.replace(m[0], '#!' + fixed);
  node.goog.googcodecheck.fs_.writeFileSync(node.goog.utils.getPath(dir, file),
      fileContents, encoding = 'utf8');
};


/**
 * @private
 * @param {string} dir The directory to code check.
 * @param {function():undefined} callback The exit callback.
 */
node.goog.googcodecheck.prototype.runFixStyle_ = function(dir, callback) {
  this.runProcess_('fixjsstyle', this.getLinterArgs_(dir), callback);
};


/**
 * @private
 * @param {string} dir The directory to code check.
 * @param {function():undefined=} callback The exit callback.
 */
node.goog.googcodecheck.prototype.runGSJLint_ = function(dir, callback) {
  this.runProcess_('gjslint', this.getLinterArgs_(dir), callback);
};


/**
 * @private
 * @type {node.goog.opts}
 */
node.goog.googcodecheck.prototype.settings_;


/**
 * @private
 * @param {string} dir The directory to codecheck.
 * @return {Array.<string>} The array of arguments for the gjslint and
 *    fixjsstyle calls.
 */
node.goog.googcodecheck.prototype.getLinterArgs_ = function(dir) {
  if (!this.settings_) {
    this.settings_ = /** @type {node.goog.opts} */
        (node.goog.utils.readSettingObject());
  }
  var excludes = this.getLinterExcludeFiles_(dir);
  var excludesDir = this.getLinterExcludeDir_(dir);
  var args = [];
  if (excludes.length) args.push('-x ' + excludes.join(','));
  if (excludesDir.length) args.push('-e ' + excludesDir.join(','));

  if (this.settings_.additionalLinterOptions) {
    args = goog.array.concat(args, this.settings_.additionalLinterOptions);
  }
  args.push(dir);
  return args;
};


/**
 * @private
 * @param {string} dir The directory to code check.
 * @return {Array.<string>} An array of all files to ignore.
 */
node.goog.googcodecheck.prototype.getLinterExcludeFiles_ = function(dir) {
  var excludes = goog.array.filter(node.goog.googcodecheck.fs_.readdirSync(dir),
      function(f) { return this.isIgnorableFile_(dir, f); }, this);
  return goog.array.map(excludes, function(f) {
    return node.goog.utils.getPath(dir, f);
  });
};


/**
 * @private
 * @param {string} dir The directory to code check.
 * @return {Array.<string>} An array of all directories to ignore.
 */
node.goog.googcodecheck.prototype.getLinterExcludeDir_ = function(dir) {
  var excludes = goog.array.filter(node.goog.googcodecheck.fs_.readdirSync(dir),
      function(f) { return this.isIgnorableDir_(dir, f); }, this);
  return goog.array.map(excludes, function(f) {
    return node.goog.utils.getPath(dir, f);
  });
};


/**
 * @private
 * @param {string} dir The directory of the files we are checking.
 * @param {string} f If this file can be ignored from the checks.
 * @return {boolean} Wether the specified file can be safely ignored.
 */
node.goog.googcodecheck.prototype.isIgnorableFile_ = function(dir, f) {
  if (node.goog.googcodecheck.isDir_(
      node.goog.utils.getPath(dir, f))) return false;

  var ignore =
      f === 'goog.js' ||
      f.indexOf('.min.js') >= 0 ||
      f.indexOf('.tmp.js') >= 0 ||
      f.indexOf('_') === 0 ||
      f.indexOf('deps.js') >= 0 ||
      f.indexOf('.extern.js') >= 0 ||
      f.indexOf('.externs.js') >= 0;

  return ignore;
};


/**
 * @private
 * @param {string} dir The directory of the files we are checking.
 * @param {string} d If this directory can be ignored from the checks.
 * @return {boolean} Wether the specified file can be safely ignored.
 */
node.goog.googcodecheck.prototype.isIgnorableDir_ = function(dir, d) {
  if (!node.goog.googcodecheck.isDir_(
      node.goog.utils.getPath(dir, d))) return false;

  return d === 'docs';
};


/**
 * @private
 * @param {string} command The command to execute.
 * @param {Array.<string>} args The arguments to pass to the command.
 * @param {function():undefined=} callback The exit callback.
 */
node.goog.googcodecheck.prototype.runProcess_ =
    function(command, args, callback) {
  command += ' ' + args.join(' ');

  var cmd = require('child_process').exec(command,
      function(err, stdout, stderr) {
        if (callback) { callback(); }
        if (err) {
          if (stderr) console.error(stderr);
          if (stdout) console.log(stdout);
          throw err;
        }

        console.log('\nSuccessfully Executed ' + command +
            (stderr ? '\n\tstderr:' + stderr : '') +
            (stdout ? '\n\tstdout: ' + stdout : ''));
      });
};

new node.goog.googcodecheck();
