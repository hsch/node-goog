#!node

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

goog.provide('node.goog.compile');



/**
 * @constructor
 */
node.goog.compile = function() {
  // Only support one file at the moment, this needs attention
  var fileToCompile = process.argv[2];
  var fileContents = node.goog.compile.fs_.
      readFileSync(fileToCompile, encoding = 'utf8');
  var tmpFileName = fileToCompile.replace('.js', '.tmp.js');
  var args = require('./utils').closureUtils.readSettingObject(fileToCompile);

  var compiledFileName = tmpFileName.replace('.tmp.js', '.min.js');
  var fileToCompileIgnore = fileToCompile.replace('.js', '.ignorejs');

  var that = this;
  this.runCompilerOrDeps_(false, fileToCompile,
      compiledFileName.substring(0, compiledFileName.lastIndexOf('/') + 1) +
          'deps.js', '', args, function() {

        var bashInst = that.createTmpFile_(tmpFileName, fileContents);
        node.goog.compile.fs_.
            renameSync(fileToCompile, fileToCompileIgnore);
        that.runCompilerOrDeps_(true, tmpFileName, compiledFileName,
            bashInst, args, function() {
              that.onExit_(tmpFileName, fileToCompileIgnore, fileToCompile);
            });
      });
};


/**
 * @private
 * @const
 * @type {extern_fs}
 */
node.goog.compile.fs_ = /** @type {extern_fs} */ (require('fs'));


/**
 * @private
 * @const
 * @type {extern_path}
 */
node.goog.compile.path_ = /** @type {extern_path} */ (require('path'));


/**
 * @private
 * @param {string} tmpFileName The temporary file name that needs to be deleted.
 * @param {string} fileToCompileIgnore The original file (renamed).  This file
 *    will be renamed back to its original name (fileToCompile).
 * @param {string} fileToCompile The original name of the file that was to be
 *    compiled.
 */
node.goog.compile.prototype.onExit_ =
    function(tmpFileName, fileToCompileIgnore, fileToCompile) {
  if (node.goog.compile.path_.existsSync(tmpFileName)) {
    node.goog.compile.fs_.unlinkSync(tmpFileName);
  }
  if (node.goog.compile.path_.existsSync(fileToCompileIgnore)) {
    node.goog.compile.fs_.renameSync(fileToCompileIgnore, fileToCompile);
  }
};


/**
 * @private
 * @param {string} tmpFileName The name of the temporary file used to compile.
 * @param {string} contents The original file contents.
 * @return {string} Any bash shell instructions that need to be copied into
 *    the compiled file.
 */
node.goog.compile.prototype.createTmpFile_ = function(tmpFileName, contents) {
  var bashInstIdx = contents.indexOf('#!node');
  var hasInst = bashInstIdx >= 0;
  var bashInst = '';

  if (hasInst) {
    var endIdx = contents.indexOf('\n', bashInstIdx) + 1;
    bashInst = contents.substring(bashInstIdx, endIdx);
    contents = contents.substring(endIdx);
  }
  var newCode = 'goog.require(\'node.goog\');' +
      (hasInst ? '\n' : '') +
      contents;
  node.goog.compile.fs_.writeFileSync(tmpFileName, newCode, encoding = 'utf8');
  return bashInst;
};


/**
 * @private
 * @param {boolean} compiler Wether to run the compiler, other wise will
 *    generate a deps.js file (name specified in compiledFileName).
 * @param {string} tmpFileToCompile The file name to compile.
 * @param {string} compiledFileName The compiled (minified) file name.
 * @param {string} bashInstructions Any bash shell instructions that are
 *    required in the compiled file.
 * @param {node_goog.opts} args The closure.json settings for this compilation.
 * @param {function():undefined} callback The callback to call on exit.
 */
node.goog.compile.prototype.runCompilerOrDeps_ = function(compiler, 
    tmpFileToCompile, compiledFileName, bashInstructions, args, callback) {
  var clArgs = compiler ?
      this.getCompilerClArgs_(tmpFileToCompile, compiledFileName, args) :
      this.getDepsClArgs_(tmpFileToCompile, compiledFileName, args);

  var exec = args.closureBasePath.replace('/closure/goog/',
      '/closure/bin/build/') + (compiler ? 'closurebuilder' : 'depswriter') +
      '.py';
  var cmd = require('child_process').spawn(exec, clArgs);

  var output = '';
  var err = '';
  cmd.stdout.on('data', function(data) {
    output += data;
  });

  cmd.stderr.on('data', function(data) {
    err += data;
  });

  cmd.on('uncaughtException', function(err) {
    if (callback) callback();
    throw err;
  });

  cmd.on('exit', function(code) {
    if (callback) callback();
    err = err.replace(/\.tmp\.js/g, '.js');
    if (code === 0) {
      output = (bashInstructions || '') + output;
      node.goog.compile.fs_.
          writeFileSync(compiledFileName, output, encoding = 'utf8');

    }
    console.log(
        (code ? 'exit code: ' + code : '') + 
        (err ? '\nSTDError: ' + err : '') +
        (code !== 0 ? '\nSTDOut:: ' + output : '') +
        '\nSuccessfully ' + (compiler ? 'compiled' : 'generated dependencies') +
        ' to: ' + compiledFileName);
  });
};


/**
 * @private
 * @param {string} tmpFileToCompile The file name to compile.
 * @param {string} compiledFileName The compiled (minified) file name.
 * @param {node_goog.opts} args The closure.json settings for this compilation.
 * @return {Array.<string>} Any additional compiler args for the compilation
 *   operation.
 */
node.goog.compile.prototype.getCompilerClArgs_ =
    function(tmpFileToCompile, compiledFileName, args) {
  var path = this.getDirectory_(tmpFileToCompile);
  var addedPaths = {};
  this.isPathInMap_(addedPaths, path);

  var clArgs = [
    '--root=' + args.closureBasePath.replace('/closure/goog/', '/'),
    '--root=' + path
  ];
  var libPath = 'lib';
  if (!this.isPathInMap_(addedPaths, libPath)) {
    clArgs.push('--root=' + libPath);
  }
  clArgs.push('--input=' + tmpFileToCompile);
  clArgs.push('--output_mode=compiled');
  clArgs.push('--compiler_jar=' + (args.compiler_jar || 'lib/compiler.jar'));

  clArgs.push(
      '--compiler_flags=--js=' + args.closureBasePath + '/deps.js',
      '--compiler_flags=--compilation_level=ADVANCED_OPTIMIZATIONS',
      '--compiler_flags=--externs=lib/node.externs.js',
      '--compiler_flags=--externs=lib/node.static.externs.js',
      '--compiler_flags=--output_wrapper=' +
      '"(function() {this.window=this;%output%})();"',
      '--compiler_flags=--debug=true',
      '--compiler_flags=--process_closure_primitives=true',
      '--compiler_flags=--warning_level=VERBOSE',
      '--compiler_flags=--jscomp_warning=accessControls',
      '--compiler_flags=--jscomp_warning=checkRegExp',
      '--compiler_flags=--jscomp_warning=checkTypes',
      '--compiler_flags=--jscomp_warning=checkVars',
      '--compiler_flags=--jscomp_warning=deprecated',
      '--compiler_flags=--jscomp_warning=fileoverviewTags',
      '--compiler_flags=--jscomp_warning=invalidCasts',
      '--compiler_flags=--jscomp_warning=missingProperties',
      '--compiler_flags=--jscomp_warning=nonStandardJsDocs',
      '--compiler_flags=--jscomp_warning=strictModuleDepCheck',
      '--compiler_flags=--jscomp_warning=undefinedVars',
      '--compiler_flags=--jscomp_warning=unknownDefines',
      '--compiler_flags=--summary_detail_level=3'
  );

  if (args.additionalCompileOptions) {
    args.additionalCompileRoots.forEach(function(opt) {
      clArgs.push('--compiler_flags=' + opt);
    });
  }

  if (args.additionalCompileRoots) {
    args.additionalCompileRoots.forEach(function(root) {
      if (!this.isPathInMap_(addedPaths, root)) {
        addedPaths[root] = 1;
        clArgs.push('--root=' + root);
      }
    });
  } else if (args.additionalDeps) {
    // Only try to guess roots if additionalCompileRoots not specified
    args.additionalDeps.forEach(function(dep) {
      clArgs.push('--root=' + dep + '/..');
    });
  }
  return clArgs;
};


/**
 * @private
 * @param {string} fileToCompile The file name to compile.
 * @param {string} compiledFileName The compiled (minified) file name.
 * @param {node_goog.opts} args The closure.json settings for this compilation.
 * @return {Array.<string>} Any additional compiler args for the compilation
 *   dependency check operation.
 */
node.goog.compile.prototype.getDepsClArgs_ =
    function(fileToCompile, compiledFileName, args) {
  var path = this.getDirectory_(fileToCompile);
  return [
    '--root_with_prefix=' + path + ' ' +
        node.goog.compile.fs_.realpathSync(path)
  ];
};


/**
 * @private
 * @param {Object.<number>} map The map to check.
 * @param {string} s The string to check in the map.
 * @return {boolean} Wether the string was already in the map.  If not it is
 *    then added to the specified map.
 */
node.goog.compile.prototype.isPathInMap_ = function(map, s) {
  var real = node.goog.compile.fs_.realpathSync(s);
  if (map[real]) return true;
  map[real] = 1;
  return false;
};


/**
 * @private
 * @param {string} file The file whose parent directory we are trying to find.
 * @return {string} The parent directory of the soecified file.
 */
node.goog.compile.prototype.getDirectory_ = function(file) {
  var pathIdx = file.lastIndexOf('/');
  var path = pathIdx > 0 ? file.substring(0, pathIdx) : '.';
  return path;
};

new node.goog.compile();
