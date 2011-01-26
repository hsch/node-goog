#!node

var spawn = require('child_process').spawn,
    fs = require('fs'),
    Script = process.binding('evals').Script;

run();

function run() {
  // Only support one file at the moment, this needs attention
  var fileToCompile = process.argv[2];
  var fileContents = fs.readFileSync(fileToCompile);
  var tmpFileName = fileToCompile.replace('.js', '.tmp.js');  
  createTmpFile(tmpFileName, fileContents);
  var parsed = parseFileContentsForCompilerArgs(fileContents);
  
  fs.renameSync(fileToCompile, fileToCompile.replace('.js', '.ignorejs'));
  runCompiler(tmpFileName, parsed, function() {
    fs.unlinkSync(tmpFileName);
    fs.renameSync(fileToCompile.replace('.js', '.ignorejs'), fileToCompile);
  });  
};

function createTmpFile(tmpFileName, code) {
  var newCode = 'goog.require(\'node.goog\');' + code;
  fs.writeFileSync(tmpFileName, newCode, encoding='utf8');  
};

function parseFileContentsForCompilerArgs(code) {
  var regex = /var\s+([\w\d^=\s]+)\s*=\s*require\(\s*['"]goog['"]\s*\)\s*\.\s*goog/gm
  var m = regex.exec(code);
  var err = 'Could not find a call to goog.init in the specified file.';
  if (!m) throw new Error(err);  
  var varName = m[1].trim();
  // console.log('varName: ' + varName);
  var regespStr = varName + '\\s*\\.\\s*init\\s*\\(\\s*({[^}]*})';
  // console.log('regespStr: ' + regespStr);
  regex = new RegExp(regespStr, 'gm');
  var m = regex.exec(code);  
  if (!m) throw new Error(err);
  var optsString = m[1];
  // console.log('optsString: ' + optsString);
  Script.runInThisContext('var opts = ' + optsString);
  if (!opts) throw new Error(err);
  // console.dir(opts);
  return opts;
};

function runCompiler(tmpFileToCompile, args, callback) {
  var clArgs = [
    '--input=' + tmpFileToCompile,
    '--root=' + args.closureBasePath + '/../..',
    '--root=.',    
    '--output_mode=compiled',
    '--compiler_jar=compiler.jar',
    '--compiler_flags=--compilation_level=ADVANCED_OPTIMIZATIONS',
    '--compiler_flags=--externs=lib/node.externs.js',
    '--compiler_flags=--output_wrapper="(function() {this.window=this;%output%})();"',
    '--output_file=' + tmpFileToCompile.replace('.tmp.js', '.min.js')
  ];
  if (args.additionalDeps) {
    args.additionalDeps.forEach(function(a) {      
      clArgs.push('--root=' + a + '/..');
    });
  }
  var closurebuilder  = spawn(args.closureBasePath + 
    '../bin/build/closurebuilder.py', clArgs);
  var output = '';
  var err = '';
  closurebuilder.stdout.on('data', function (data) {
    output += data;
  });

  closurebuilder.stderr.on('data', function (data) {
    err += data;
  });

  closurebuilder.on('exit', function (code) {        
    if (callback) callback();
    if (code !== 0 || err) {
      console.log('ERROR: ' + err + '\n\n\nOUTPUT: ' + output); 
    } 
    else {
      console.log('Successfully Compiled - Output: ' + output);
    }    
  });
};