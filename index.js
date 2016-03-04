var fs = require('fs');
var mkdirp = require('mkdirp');

function writeScreenShot(data, filename) {
  var stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function parameterizeFilename(spec) {
  return spec.replace(/\W+/g, "-").replace(/(^-|-$)/g, '');
}

function filenameForSpec(config, spec) {
  var name = parameterizeFilename(spec);

  return config.filename
    .replace(':dir', config.directory)
    .replace(':spec', name)
  ;
}

function ScreenshotReporter(config) {
  config = config || {};
  config.directory = config.directory || 'tmp/screenshots';
  config.filename  = config.filename  || ':dir/:spec.png';
  this.config = config;
};

/*
 *  Create tmp/screenshots if it doesn't exist
 */
ScreenshotReporter.prototype.jasmineStarted = function(suiteInfo) {
  mkdirp.sync(this.config.directory);
};

/*
 *  Take a screenshot and write it to the a
 *  parameterized file name based on the spec.
 */
ScreenshotReporter.prototype.specDone = function(result) {
  var filename = filenameForSpec(this.config, result.fullName);
  browser.takeScreenshot().then(function (png) {
    writeScreenShot(png, filename);
  });
};

module.exports = ScreenshotReporter;
