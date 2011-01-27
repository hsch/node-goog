#!node

// TODO: Read some extra info from the .markdown files which should be fairly 
// easy to parse


var fs = require('fs');
var DEBUG_TYPE; //= 'child_process';

// Take this in a command line arg and default if not provided
var nodeDir = '../lib/node';
var buffer = [];
var done = {
  setTimeout:1,
  setInterval:1,
  clearTimeout:1,
  clearInterval:1
};
run();

function run() {  
  var staticHeader = 'var node_goog = {};\n' +
    'node_goog.goog = {};\n' +
    'node_goog.goog.init = function(opts) {};\n' +
    '\n' +
    'node_goog.opts = {\n' +
    '  closureBasePath: {},\n' +
    '  additionalDeps: []\n' +
    '};\nvar exports;\n';
  buffer.push(staticHeader);
      
  doAllGlobalObjects(buffer); 
  doAllFiles(nodeDir + '/lib', buffer);  
  fs.writeFileSync(__dirname + '/node.externs.js', buffer.join('\n\n'));
};

function doAllGlobalObjects(buffer) {  
  writeObjectFromMarkdown('globals', '', buffer);
  writeObject('', global, buffer);
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
  } catch (ex) { 
    console.log('Could not extern ' + name + 
      ' as it does not successfully "require".');
    return; 
  };
};

function writeObjectFromMarkdown(markdownFileName, namespace, buffer) {
  if (DEBUG_TYPE && markdownFileName !== DEBUG_TYPE) return;
  var contents = fs.readFileSync(nodeDir + '/doc/api/' + markdownFileName + 
    '.markdown', encoding='utf8');  
  
  if (namespace && !writeObjectNS(namespace, buffer)) { return; }
  
  var regex = /### (.*)/g
  var m;
  while (m = regex.exec(contents)) {        
    writeMarkdownProp(namespace, m[1], buffer)
  }  
};

function writeMarkdownProp(prefix, prop, buffer) {
  var isFunction = prop.indexOf('()') >= 0;
  if (isFunction) prop = prop.replace('()', '');
  writePropImpl(prefix, prop, isFunction, false, null, buffer);
};

function writeObject(name, o, buffer) {    
  if (DEBUG_TYPE && name !== DEBUG_TYPE) return;
  if (DEBUG_TYPE) console.dir(o);

  if (name) {
    name = 'extern_' + name;
    if (!writeObjectNS(name, buffer)) { return; }
  }
  writeObjectProps(name, o, buffer);      
  console.log(name + ' successfully externed');
};

function writeObjectNS(name, buffer) {
  if (isDone(name)) { return false; }
  
  buffer.push('var ' + name + ' = {};');
  return true;
};

function writeObjectProps(prefix, obj, buffer) {
  console.log('writeObjectProps: ' + prefix);
  writeObjectPropsImpl(prefix, obj, buffer);
  if (obj.super_) writeObjectPropsImpl(prefix, obj.super_, buffer);
};

function writeObjectPropsImpl(prefix, obj, buffer) {
  for (var prop in obj) {    
    if (DEBUG_TYPE) console.log('prop: ' + prop);
    writeProp(prefix, prop, obj[prop], buffer);
  };
};

function writeProp(prefix, prop, val, buffer) {  
  if (prop.indexOf('_') === prop.length - 1 || prop.indexOf('_') === 0 || 
    prop === 'throws') return; // assume private
  
  var isFunction = typeof (val) === 'function';
  var isObject = isFunction && 
      prop.charAt(0).toUpperCase() == prop.charAt(0);
  writePropImpl(prefix, prop, isFunction, isObject, val, buffer);    
};

function writePropImpl(prefix, prop, isFunction, isObject, val, buffer) {
  if (isDone(prop)) { return; }    
  var type = (prefix ? prefix + '.' : '') + prop;
  var typeAndVar = type.indexOf('.') < 0 ? ('var ' + type) : type;  
  // console.log('writePropImpl prefix: ' + prefix + ' prop: ' + prop + ' type: ' + type + ' typeAndVar: ' + typeAndVar);
  var desc;    
  if (isFunction) {
    desc = '/**\n * @type {Function}\n */\n' + typeAndVar;
  } else { desc = typeAndVar; }
  
  if (isFunction) {
    desc += ' = function() {};';    
  } else {
    desc += ';';
  };
  buffer.push(desc);
  if (isObject) {
    console.log('writeObjectProps type: ' + type);
    writeObjectProps(type + '.prototype', val, buffer);
  }
};

function isDone(name) {  
  if (done[name]) { return true; }
  done[name] = true;
    
  return false;
};