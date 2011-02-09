#!/usr/local/bin/node

require('goog').goog.init();

goog.require('goog.testing.jsunit');

goog.require('node.goog.tests');

var fs_ = require('fs');
var allTestFiles;
var tmpfile = node.goog.utils.getPath(process.cwd(), 'tests/_tmpclosuretest.js');
var results = {};
var maxTests = -1;
var start = Date.now();

function setUpPage() {
  // TODO: This assumes the googtest command is running in
  // the node-goog directory.
  allTestFiles = node.goog.tests.readDirRecursiveSync
    ('third_party/closure-library/closure/goog/', '_test[\d\w_]*\.(html|js)');
  asyncTestCase.stepTimeout = 10000;
};

function tearDownPage() { fs_.unlinkSync(tmpfile); };

function testClousreTests() {
  assertTrue('Could not find test files', allTestFiles.length > 10);
  runNextTest_();
};

function runNextTest_() {
  if (maxTests-- === 0 || allTestFiles.length === 0) { return onCompleted_(); }
  var test = allTestFiles.pop();
  var contents = fs_.readFileSync(test, 'utf-8');
  if (test.indexOf('.js') < 0) {
    contents = convertToJS_(contents);
  }
  runTestImpl_(contents, test);
};

function convertToJS_(html)  {
  var blocks = [];
  var idx = html.indexOf('<script');
  while (idx >= 0) {
    idx = html.indexOf('>', idx);
    var endIdx = html.indexOf('</script>', idx);
    blocks.push(html.substring(idx + 1, endIdx));
    html = html.substring(endIdx + 9);
    idx = html.indexOf('<script')
  }
  return blocks.join('\n');
};

function runTestImpl_(contents, file) {
  fs_.writeFileSync(tmpfile, contents, 'utf-8');
  asyncTestCase.waitForAsync();
  require('child_process').exec('googtest ' + tmpfile,
      function(err, stdout, stderr) {
    var shortFile = file.substring(file.lastIndexOf('/') + 1);
    var r = {success:false,contents:contents};
    if (err) r.exception = err;
    if (stdout.indexOf(', 0 failed') < 0) {
      if (stderr) { r.message = stderr; }
      else {
        var underlineIdx = stdout.indexOf('------');
        r.message = stdout.substring(stdout.indexOf('\n', underlineIdx) + 1).
          replace(/\[0\;3\dm/g, '').
          replace(/\n/g, '\<br \/\>');
      }
    } else { r.success = true; }

    if (stdout) {
      var summaryLine = goog.array.find(stdout.split('\n'),
        function(l) { return l.indexOf(' passed, ') >= 0; });
      if (summaryLine) r.summary = summaryLine.substring(7);
    };
    results[shortFile] = r;
    asyncTestCase.continueTesting();
    runNextTest_();
  });
};

function onCompleted_() {
  var failures = 0, successes = 0;
  var reportFile = [
    '<table border="1"><tr>',
    '<th>Test</th><th>Results</th><th>Summary</th><th>' +
    'Details (Mouse Over for Code)</th>'
  ];
  for (var i in results) {
    var r = results[i];
    if (!r.success) { failures++; }
    else successes++;

    reportFile.push('<tr><td>' + i + '</td>' +
      '<td>' + (!r.success ? 'Fail' : 'Success') + '</td>' +
      '<td> ' + r.summary + '</td>' +
      '<td title="' + r.contents +
        '">' + (r.exception ? r.exception : (r.message || 'n/a') + '</td></tr>'));
  };
  var took = Date.now() - start;
  fs_.writeFileSync('tests/closure_tests_report.html',
                    '<html><body><h1>Closure Library Tests Results ' +
                    '(Success: ' + successes + '/' +
                        (failures + successes) + ') - Took: ' + took +
                        'ms</h1>' +
                    reportFile.join('\n') +
                    '</table></body></html>', 'utf-8');
  assertEquals(
    'Some tests failed, see tests/closure_tests_report.html for full details.' +
    ' Failures: ', 0, failures);
};

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();