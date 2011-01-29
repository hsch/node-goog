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

goog.
 
var fs = require('fs')    
var DEBUG_TYPE; //= 'child_process';

var nodeDir = common_utils.readSettingObject().nodeDir;
if (!nodeDir) throw new Error('To run the genextens.js script you must declare ' +
  'a nodeDir property in the global closure.json settings file located in the ' +
  'bin directory of node-goog');
var buffer = [];

var done = {
  setTimeout:1,
  setInterval:1,
  clearTimeout:1,
  clearInterval:1
};

run();

function run() {      
  initialiseDoneExterns();
  doAllGlobalObjects(buffer); 
  doAllFiles(nodeDir + '/lib', buffer);  
  fs.writeFileSync(__dirname + '/node.externs.js', buffer.join('\n\n'));
};

function initialiseDoneExterns() {
  var staticExterns =  fs.readFileSync(__dirname + '/node.static.externs.js', 
    encoding='utf8');  
  var m, regex = /var\s*([^\s]+)|(^[\w_\.^;]+)/gm
  while (m = regex.exec(staticExterns)) {     
    var extern = m[1] === undefined ? m[2] : m[1];
    done[extern] = 1;    
  }  
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
  
  var m, regex = /### (.*)/g  
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
  writeObjectProps(!name ? name : name + '.prototype', o, buffer);        
};

function writeObjectNS(name, buffer) {
  if (isDone(name)) { return false; }
  
  buffer.push('/**\n @constructor\n */\nvar ' + name + ' = {};');
  return true;
};

function writeObjectProps(prefix, obj, buffer) {  
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
    writeObjectProps(type + '.prototype', val, buffer);
  }
};

function isDone(name) {  
  if (done[name]) { return true; }
  done[name] = true;
    
  return false;
};