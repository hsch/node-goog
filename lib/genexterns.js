#!node

var fs = require('fs');

run();

function run() {  
  var staticHeader = 'var node_goog = {};\n' +
    'node_goog.goog = {};\n' +
    'node_goog.goog.init = function(opts) {};\n' +
    '\n' +
    'node_goog.opts = {\n' +
    '  closureBasePath: {},\n' +
    '  additionalDeps: []\n' +
    '};\n';
  var buffer = [staticHeader];
    
  doAllGlobalObjects(buffer);
  var nodeLibDir = '../../node/lib';
  doAllFiles(nodeLibDir, buffer);  
  fs.writeFileSync(__dirname + '/node.externs.js', buffer.join('\n\n'), encoding='utf8');
};

function doAllGlobalObjects(buffer) {
  writeObject('process', process, buffer);
};

function doAllFiles(dir, buffer) {
  var files = fs.readdirSync(dir);
  files.forEach(function(f) { doFile(f, buffer); });  
};

function doFile(f, buffer) {  
  var name = f.replace('.js', '');    
  try {
    var o = require(name);    
    writeObject(name, o, buffer);    
  } catch (ex) { return; };
};

function writeObject(name, o, buffer) {  
  writeObjectNS(name, buffer);     
  writeObjectProps(name, o, buffer);      
  console.log(name + ' successfully externed');
};

function writeObjectNS(fName, buffer) {
  buffer.push('var ' + fName + ' = {};');
};

function writeObjectProps(prefix, obj, buffer) {
  for (var prop in obj) {
    writeProp(prefix, prop, obj[prop], buffer);
  };
};

function writeProp(prefix, prop, val, buffer) {
  if (prop.indexOf('_') === prop.length - 1 || prop.indexOf('_') === 0 || prop === 'throws') return; // assume private
  
  var type = prefix + '.' + prop;
  var desc = type;
  var isFunction = typeof (val) === 'function';
  var isObject = isFunction && 
      prop.charAt(0).toUpperCase() == prop.charAt(0);
  if (isFunction) {
    desc += ' = function() {};';    
  } else {
    desc += ';';
  };
  buffer.push(desc);
  if (isObject) {
    writeObjectProps(type + '.prototype', val, buffer);
  }
};