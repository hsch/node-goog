/**
 * @name node.tty
 * @namespace
 * Use <code>require('tty')</code> to access this module.
 *
 * Example:
 * <pre>
 *     var tty = require('tty');
 *     tty.setRawMode(true);
 *     process.stdin.resume();
 *     process.stdin.on('keypress', function(char, key) {
 *       if (key && key.ctrl && key.name == 'c') {
 *         console.log('graceful exit');
 *         process.exit()
 *       }
 *     });
 * </pre>
 */

goog.provide("node.tty");


/**
 * @private
 * @type {*}
 */
node.tty.core_ = require("tty");