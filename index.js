var fs     = require('fs');
var path   = require('path');
var mkdirp = require('mkdirp');

function writeScreenShot(data, filename) {
  var stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function parameterizeFilename(spec) {
  return spec.replace(/\W+/g, '-').replace(/(^-|-$)/g, '');
}

function filenameForSpec(config, spec) {
  var name = parameterizeFilename(spec.fullName);
  var file = config.filename;

  // Convert function to filename.
  if(typeof file === 'function') { file = file(spec); }

  return file
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
 *  Take a screenshot and write it to the a
 *  parameterized file name based on the spec.
 */
ScreenshotReporter.prototype.specDone = function(result) {
  var filename = filenameForSpec(this.config, result);

  // Create any required directories for the file.
  mkdirp.sync(path.dirname(filename));

  browser.takeScreenshot().then(function(png) {
    writeScreenShot(png, filename);
  });
};

module.exports = ScreenshotReporter;
