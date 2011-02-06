#!/usr/local/bin/node

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
 * @fileoverview Utility to compile a specific JS project.
 *
 * @author guido@tapia.com.au (Guido Tapia)
 */


require('goog').goog.init();

goog.provide('node.goog.googcompile');

goog.require('node.goog.utils');



/**
 * @constructor
 */
node.goog.googcompile = function() {

  /**
  * @private
  * @const
  * @type {extern_fs}
  */
  this.fs_ = /** @type {extern_fs} */ (require('fs'));


  /**
  * @private
  * @const
  * @type {extern_path}
  */
  this.path_ = /** @type {extern_path} */ (require('path'));

  /**
   * @private
   * @type {boolean}
   */
  this.quiet_ = false;

  /**
   * @private
   * @type {boolean}
   */
  this.nodeps_ = false;

  /**
   * @private
   * @type {string}
   */
  this.fileToCompile_;

  /**
   * @private
   * @type {string}
   */
  this.tmpFileName_;

  /**
   * @private
   * @type {string}
   */
  this.compiledFileName_;

  /**
   * @private
   * @type {string}
   */
  this.fileToCompileIgnore_;

  /**
   * @private
   * @type {?node.goog.opts}
   */
  this.args_;

  var cli = require('cli');
  var options = cli.parse({
    'quiet': ['q', 'Quit compilation, do not produce .min.js and deps.js ' +
          'files.'],
    'nodeps': ['n', 'Does not build the dependencies file.']
  });

  var that = this;
  cli.main(function(args, options) { that.init_(args, options); });
};


/**
 * @private
 * @param {Array.<string>} cliArgs The command line args.
 * @param {Object.<string>} options The parsed options.
 */
node.goog.googcompile.prototype.init_ = function(cliArgs, options) {
  var that = this;
  var onexit = function(err) { that.onExit_.call(that, err); };
  process.on('exit', onexit);
  process.on('SIGINT', onexit);
  process.on('uncaughtException', onexit);

  this.quiet_ = options.quiet === true;
  this.nodeps_ = options.nodeps === true;
  this.fileToCompile_ = cliArgs[cliArgs.length - 1];

  this.tmpFileName_ = this.fileToCompile_.replace('.js', '.tmp.js');
  this.args_ = node.goog.utils.readSettingObject(this.fileToCompile_);

  this.compiledFileName_ = this.tmpFileName_.replace('.tmp.js', '.min.js');
  this.fileToCompileIgnore_ = this.fileToCompile_.replace('.js', '.ignorejs');

  this.runCommands_();
};


/**
 * @private
 */
node.goog.googcompile.prototype.runCommands_ = function() {
  var command = this.quiet_ || this.nodeps_ ?
      this.runCompilation_ : this.runDependencies_;
  command.call(this);
};


/**
 * @private
 */
node.goog.googcompile.prototype.runDependencies_ = function() {
  var that = this;
  var fileDir = this.compiledFileName_.substring(0,
      this.compiledFileName_.lastIndexOf('/') + 1);
  var depsFile = node.goog.utils.getPath(fileDir, 'deps.js');
  this.runCompilerOrDeps_(false, depsFile, '', function() {
    that.runCompilation_();
  });
};


/**
 * @private
 */
node.goog.googcompile.prototype.runCompilation_ = function() {
  var fileContents = this.fs_.
      readFileSync(this.fileToCompile_, encoding = 'utf8');

  var bashInst = this.createTmpFile_(fileContents);
  this.fs_.
      renameSync(this.fileToCompile_, this.fileToCompileIgnore_);
  this.runCompilerOrDeps_(true, this.compiledFileName_, bashInst);
};


/**
 * @private
 * @param {Error=} err An optional error.
 */
node.goog.googcompile.prototype.onExit_ =
    function(err) {
  if (this.path_.existsSync(this.tmpFileName_)) {
    this.fs_.unlinkSync(this.tmpFileName_);
  }
  if (this.path_.existsSync(this.fileToCompileIgnore_)) {
    this.fs_.renameSync(this.fileToCompileIgnore_, this.fileToCompile_);
  }
  if (err) {
    console.error(err.message + '\n' + err.stack);
    throw err;
  }
};


/**
 * @private
 * @param {string} contents The original file contents.
 * @return {string} Any bash shell instructions that need to be copied into
 *    the compiled file.
 */
node.goog.googcompile.prototype.createTmpFile_ =
    function(contents) {
  var bashInstIdx = contents.indexOf('#!');
  var hasInst = bashInstIdx === 0; // Must be top line
  var bashInst = '';

  if (hasInst) {
    var endIdx = contents.indexOf('\n') + 1;
    bashInst = contents.substring(bashInstIdx, endIdx);
    contents = contents.substring(endIdx);
  }
  var newCode = //'goog.require(\'node.goog\');' +
      (hasInst ? '\n' : '') +
      contents;
  this.fs_.writeFileSync(this.tmpFileName_, newCode,
      encoding = 'utf8');
  return bashInst;
};


/**
 * @private
 * @param {boolean} compiler Wether to run the compiler, other wise will
 *    generate a deps.js file (name specified in compiledFileName).
 * @param {string} targetFile The name of the file to produce.
  * @param {string} bashInstructions Any bash shell instructions that are
 *    required in the compiled file.
 * @param {function():undefined=} callback The callback to call on exit.
 */
node.goog.googcompile.prototype.runCompilerOrDeps_ = function(compiler,
    targetFile, bashInstructions, callback) {
  var clArgs = compiler ?
      this.getCompilerClArgs_() :
      this.getDepsClArgs_();

  var exec = node.goog.utils.getPath(this.args_.closureBasePath,
      'closure/bin/build/' +
      (compiler ? 'closurebuilder.py ' : 'depswriter.py '));
  var that = this;
  var cmd = require('child_process').exec(exec + clArgs.join(' '),
      function(err, stdout, stderr) {
        if (callback) callback();
        if (err) throw err;
        stderr = stderr.replace(/\.tmp\.js/g, '.js');
        stdout = stdout.replace(/\.tmp\.js/g, '.js');
        if (stderr) console.error(stderr);
        if (stdout && !that.quiet_) {
          stdout = (bashInstructions || '') + stdout;
          that.fs_.writeFileSync(targetFile, stdout, encoding = 'utf8');
        }
      });
};


/**
 * @private
 * @return {Array.<string>} Any additional compiler args for the compilation
 *   operation.
 */
node.goog.googcompile.prototype.getCompilerClArgs_ =
    function() {
  var path = this.getDirectory_(this.tmpFileName_);
  var addedPaths = {};
  this.isPathInMap_(addedPaths, path);
  var clArgs = [
    '--root=' + this.args_.closureBasePath,
    '--root=' + path
  ];
  var libPath = node.goog.utils.getPath(__dirname, '../lib');
  var binPath = node.goog.utils.getPath(__dirname, '../bin');
  if (!this.isPathInMap_(addedPaths, libPath)) {
    clArgs.push('--root=' + libPath);
  }
  if (!this.isPathInMap_(addedPaths, binPath)) {
    clArgs.push('--root=' + binPath);
  }
  clArgs.push('--input=' + this.tmpFileName_);
  clArgs.push('--output_mode=compiled');
  clArgs.push('--compiler_jar=' + (this.args_.compiler_jar ||
      node.goog.utils.getPath(__dirname,
      '../third_party/ignoregoogcompiler.jar')));

  clArgs.push(
      '--compiler_flags=--js=' +
      node.goog.utils.getPath(this.args_.closureBasePath,
      'closure/goog/deps.js'),
      '--compiler_flags=--compilation_level=ADVANCED_OPTIMIZATIONS',
      '--compiler_flags=--externs=' +
      node.goog.utils.getPath(libPath, 'node.externs.js'),
      '--compiler_flags=--externs=' +
      node.goog.utils.getPath(libPath, 'node.static.externs.js'),
      '--compiler_flags=--output_wrapper=' +
      '"(function() {this.window=this;%output%})();"'
  );

  if (this.args_.additionalCompileOptions) {
    this.args_.additionalCompileOptions.forEach(function(opt) {
      clArgs.push('--compiler_flags=' + opt);
    });
  }

  if (this.args_.additionalCompileRoots) {
    this.args_.additionalCompileRoots.forEach(function(root) {
      if (!this.isPathInMap_(addedPaths, root)) {
        clArgs.push('--root=' + root);
      }
    });
  } else if (this.args_.additionalDeps) {
    // Only try to guess roots if additionalCompileRoots not specified
    this.args_.additionalDeps.forEach(function(dep) {
      var path = dep.substring(0, dep.lastIndexOf('/'));
      if (!this.isPathInMap_(addedPaths, path)) {
        clArgs.push('--root=' + path);
      }
    }, this);
  }
  return clArgs;
};


/**
 * @private
 * @return {Array.<string>} Any additional compiler args for the compilation
 *   dependency check operation.
 */
node.goog.googcompile.prototype.getDepsClArgs_ =
    function() {
  var path = this.getDirectory_(this.fileToCompile_);
  return ['"--root_with_prefix=' + path + ' ' +
        this.fs_.realpathSync(path) + '"'];
};


/**
 * @private
 * @param {Object.<number>} map The map to check.
 * @param {string} s The string to check in the map.
 * @return {boolean} Wether the string was already in the map.  If not it is
 *    then added to the specified map.
 */
node.goog.googcompile.prototype.isPathInMap_ = function(map, s) {
  var real = this.fs_.realpathSync(s);
  if (map[real]) return true;
  map[real] = 1;
  return false;
};


/**
 * @private
 * @param {string} file The file whose parent directory we are trying to find.
 * @return {string} The parent directory of the soecified file.
 */
node.goog.googcompile.prototype.getDirectory_ = function(file) {
  var pathIdx = file.lastIndexOf('/');
  var path = pathIdx > 0 ? file.substring(0, pathIdx) : '.';
  return path;
};

new node.goog.googcompile();
