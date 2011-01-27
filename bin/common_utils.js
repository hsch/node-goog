var fs = require('fs'),
    Script = process.binding('evals').Script;

function CommonUtils() {
  this.cachedArgs = null;
};

CommonUtils.prototype.readSettingObject = function(fileToCompile) {
  if (this.cachedArgs) return this.cachedArgs;
  
  var contents = fileToCompile ? fs.readFileSync(fileToCompile, encoding='utf8') : null; 
  var fileSettings = contents ? parseCompilerArgsFromFile(contents) : null;
    
  fileToCompile = fileToCompile || process.argv[1];
  var dirIdx = fileToCompile.lastIndexOf('/');
  var dir = dirIdx > 0 ? fileToCompile.substring(0, dirIdx) : '.';
  
  var codeDirSettings = readArgsFromJSONFile(dir + '/closure.json');    
  var globalSettings = readArgsFromJSONFile(__dirname + '/closure.json');      
  
  var settings = globalSettings || {};
  if (codeDirSettings) {
    for (var i in codeDirSettings) {
      settings[i] = codeDirSettings[i];
    }
  }
  if (fileSettings) {
    for (var i in fileSettings) {
      settings[i] = fileSettings[i];
    }
  }
  this.cachedArgs = settings      
  return this.cachedArgs;
};

function readArgsFromJSONFile(file) {
  try {
    var json = fs.readFileSync(file,   
      encoding='utf8');
    return getOptsObject(json);
  } catch (ex) {
    return null;
  }
};

function parseCompilerArgsFromFile(code) {
  var regex = /var\s+([\w\d^=\s]+)\s*=\s*require\(\s*['"]goog['"]\s*\)\s*\.\s*goog/gm
  var m = regex.exec(code);
  var err = 'Could not find a call to goog.init in the specified file.';
  if (!m) return null;
  var varName = m[1].trim();
  var regespStr = varName + '\\s*\\.\\s*init\\s*\\(\\s*({[^}]*})';  
  regex = new RegExp(regespStr, 'gm');
  var m = regex.exec(code);  
  if (!m) return null;
  var optsString = m[1];  
  return getOptsObject(optsString);
}

function getOptsObject(optsString) {
  Script.runInThisContext('var opts = ' + optsString);
  if (!opts) throw new Error(err);  
  return opts;
};  

exports.common_utils = new CommonUtils();