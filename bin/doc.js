#!node

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