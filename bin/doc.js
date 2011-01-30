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

goog.provide('node.goog.doc');



/**
 * @constructor
 */
node.goog.doc = function() {
  var args = require('./utils').closureUtils.readSettingObject();
  var jsDocToolkitDir = args.jsdocToolkitDir;
  if (!jsDocToolkitDir) {
    throw new Error('To run the jsdoc-toolkit documentation module please ' +
        'specify a jsdocToolkitDir property pointing to the jsdoc-toolkit root ' +
        'directory.  This setting can reside in the global closure.json ' +
        'settings file or the closure.json file in the code root dir');
  }

  this.init_(jsDocToolkitDir, process.argv[2]);
};


/**
 * @private
 * @param {string} jsDocToolkitDir The directory of the jsdoc-toolkit lib.
 * @param {string} entryPoint The file/directory to document.
 */
node.goog.doc.prototype.init_ = function(jsDocToolkitDir, entryPoint) {
  var entryPointDirIdx = entryPoint.lastIndexOf('/');
  var entryPointDir = entryPointDirIdx > 0 ?
      entryPoint.substring(0, entryPointDirIdx) : '.';

  /** @type {extern_process} */
  var jsdoc = require('child_process').spawn('java', [
    '-jar',
    jsDocToolkitDir + 'jsrun.jar',
    jsDocToolkitDir + 'app/run.js',
    '-a',
    '-t=' + jsDocToolkitDir + 'templates/jsdoc/',
    '-d=' + entryPointDir + '/docs',
    '-r=10',
    '-E=\.min\.js',
    '-E=deps\.js',
    entryPointDir
  ]);

  var output = '';
  var err = '';

  jsdoc.stdout.on('data', function(data) {
    output += data;
  });

  jsdoc.stderr.on('data', function(data) {
    err += data;
  });

  jsdoc.on('exit', function(code) {

    if (code !== 0) {
      console.log('CODE: ' + code + ' ERROR: ' + err +
          '\n\n\nOUTPUT: ' + output);
    } else {
      console.log(err + '\nSuccessfully js-doc\'ed\n' + output);
    }
  });
};

new node.goog.doc();
