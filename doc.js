#!node

var spawn = require('child_process').spawn,
    fs = require('fs');

var jsDocToolkitDir = '../lib/jsdoc-toolkit/'

run();

function run() {
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