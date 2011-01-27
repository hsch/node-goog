#!node

/*
 * Copyright 2011 Guido Tapia (guido@tapia.com.au)
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


var spawn = require('child_process').spawn,
    fs = require('fs'),
    common_utils = require('./common_utils').common_utils;
run();

function run() {
  var args = common_utils.readSettingObject();
  var jsDocToolkitDir = args.jsdocToolkitDir;
  if (!jsDocToolkitDir) {
    throw new Error('To run the jsdoc-toolkit documentation module please ' +
      'specify a jsdocToolkitDir property pointing to the jsdoc-toolkit root ' +
      'directory.  This setting can reside in the global closure.json ' +
      'settings file or the closure.json file in the code root dir');
  }
  var entryPoint = process.argv[2];
  var entryPointDirIdx = entryPoint.lastIndexOf('/');
  var entryPointDir = entryPointDirIdx > 0 ? 
    entryPoint.substring(0, entryPointDirIdx) : '.';
  var jsdoc = spawn('java', [
    '-jar',
    jsDocToolkitDir + 'jsrun.jar',
    jsDocToolkitDir + 'app/run.js',
    '-a',
    '-t=' + jsDocToolkitDir + 'templates/jsdoc/',
    '-d=' + entryPointDir + '/docs',
    entryPoint
  ]);
  
  var output = '';
  var err = '';
  
  jsdoc.stdout.on('data', function (data) {
    output += data;
  });

  jsdoc.stderr.on('data', function (data) {
    err += data;
  });  

  jsdoc.on('exit', function (code) {            
    
    if (code !== 0) {
      console.log('CODE: ' + code + ' ERROR: ' + err + '\n\n\nOUTPUT: ' + output); 
    } else {            
      console.log(err + '\nSuccessfully js-doc\n' + output);
    }    
  });
};