#!node

/**
 * @fileoverview Copyright 2011 Guido Tapia (guido@tapia.com.au)
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

require( 'goog' ).goog.init();

goog.provide('node.goog.genexterns');
 
goog.require('goog.array');

/**
 * @constructor
 */
node.goog.genexterns = function() {  
  var opts = /** @type {node_goog.opts} */ 
    (require('../bin/utils').closureUtils.readSettingObject());
  
  /**
   * @private
   * @const
   * @type {string}
   */
  this.nodeDir_ = opts.nodeDir;
  if (!this.nodeDir_) throw new Error('To run the genextens.js script you must declare ' +
    'a nodeDir property in the global closure.json settings file located in the ' +
    'bin directory of node-goog');
  
  /**
   * @private
   * @type {Array.<string>}
   */
  this.buffer_ = [];

  /**
   * @private
   * @type {Object.<number>}
   */
  this.done_ = {
    setTimeout:1,
    setInterval:1,
    clearTimeout:1,
    clearInterval:1
  };
  
  this.run_();
};

/**
 * @private
 * @const
 * @type {extern_fs}
 */
node.goog.genexterns.fs_ = /** @type {extern_fs} */ (require('fs'));

/** 
 * @private
 */
node.goog.genexterns.prototype.run_ = function() {      
  this.initialiseDoneExterns_();
  this.doAllGlobalObjects_(); 
  this.doAllFiles_(this.nodeDir_ + '/lib');  
  node.goog.genexterns.fs_.writeFileSync(__dirname + '/node.externs.js', this.buffer_.join('\n\n'));
};

/** 
 * @private
 */
node.goog.genexterns.prototype.initialiseDoneExterns_ = function() {
  var staticExterns =  node.goog.genexterns.fs_.readFileSync(__dirname + '/node.static.externs.js', 
    encoding='utf8');  
  var m, regex = /var\s*([^\s]+)|(^[\w_\.^;]+)/gm
  while (m = regex.exec(staticExterns)) {     
    var extern = m[1] === undefined ? m[2] : m[1];
    this.done_[extern] = 1;    
  }  
};

/** 
 * @private
 */
node.goog.genexterns.prototype.doAllGlobalObjects_ = function() {  
  this.writeObjectFromMarkdown_('globals', '');
  this.writeObject_('', global);
  this.writeObject_('process', process);
};

/** 
 * @private
 */
node.goog.genexterns.prototype.doAllFiles_ = function(dir) {
  var files = node.goog.genexterns.fs_.readdirSync(dir);
  goog.array.forEach(files, function(f) { this.doFile_(f); }, this);  
};

/** 
 * @private
 */
node.goog.genexterns.prototype.doFile_ = function(f) {  
  var name = f.replace('.js', '');    
  
  try {
    var o = require(name);        
    this.writeObject_(name, o);    
  } catch (ex) { 
    console.log('Could not extern ' + name + 
      ' as it does not successfully "require".');
    return; 
  };
};

/** 
 * @private
 */
node.goog.genexterns.prototype.writeObjectFromMarkdown_ = function(markdownFileName, namespace) {  
  var contents = node.goog.genexterns.fs_.readFileSync(this.nodeDir_ + '/doc/api/' + markdownFileName + 
    '.markdown', encoding='utf8');  
  
  if (namespace && !this.writeObjectNS_(namespace)) { return; }
  
  var m, regex = /### (.*)/g  
  while (m = regex.exec(contents)) {        
    this.writeMarkdownProp_(namespace, m[1])
  }  
};

/** 
 * @private
 */
node.goog.genexterns.prototype.writeMarkdownProp_ = function(prefix, prop) {
  var isFunction = prop.indexOf('()') >= 0;
  if (isFunction) prop = prop.replace('()', '');
  this.writePropImpl_(prefix, prop, isFunction, false, null);
};

/** 
 * @private
 */
node.goog.genexterns.prototype.writeObject_ = function(name, o) {     
  if (name) {
    name = 'extern_' + name;
    if (!this.writeObjectNS_(name)) { return; }
  }
  this.writeObjectProps_(!name ? name : name + '.prototype', o);        
};

/** 
 * @private
 */
node.goog.genexterns.prototype.writeObjectNS_ = function(name) {
  if (this.isDone_(name)) { return false; }
  
  this.buffer_.push('/**\n @constructor\n */\nvar ' + name + ' = {};');
  return true;
};

/** 
 * @private
 */
node.goog.genexterns.prototype.writeObjectProps_ = function(prefix, obj) {  
  this.writeObjectPropsImpl_(prefix, obj);
  if (obj.super_) this.writeObjectPropsImpl_(prefix, obj.super_);
};

/** 
 * @private
 */
node.goog.genexterns.prototype.writeObjectPropsImpl_ = function(prefix, obj) {
  for (var prop in obj) {        
    this.writeProp_(prefix, prop, obj[prop]);
  };
};

/** 
 * @private
 */
node.goog.genexterns.prototype.writeProp_ = function(prefix, prop, val) {  
  if (prop.indexOf('_') === prop.length - 1 || prop.indexOf('_') === 0 || 
    prop === 'throws') return; // assume private
  
  var isFunction = typeof (val) === 'function';
  var isObject = isFunction && 
      prop.charAt(0).toUpperCase() == prop.charAt(0);
  this.writePropImpl_(prefix, prop, isFunction, isObject, val);    
};

/** 
 * @private
 */
node.goog.genexterns.prototype.writePropImpl_ = function(prefix, prop, isFunction, isObject, val) {
  if (this.isDone_(prop)) { return; }    
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
  this.buffer_.push(desc);
  if (isObject) {    
    this.writeObjectProps_(type + '.prototype', val);
  }
};

/** 
 * @private
 */
node.goog.genexterns.prototype.isDone_ = function(name) {  
  if (this.done_[name]) { return true; }
  this.done_[name] = 1;
    
  return false;
};

new node.goog.genexterns();