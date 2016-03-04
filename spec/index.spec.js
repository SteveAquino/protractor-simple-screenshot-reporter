var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

/*
 *  Stub out protractor's browser objects
 */
browser = {
  takeScreenshot: function() {
    return { then: function(callback) {
      callback('test', 'test');
    }}
  }
};

var ScreenshotReporter = require('../index.js');

describe('ScreenshotReporter', function() {
  afterEach(function() { rimraf.sync('tmp/'); });

  describe('.jasmineStarted()', function() {
    it('creates a screenshot directory with default options', function() {
      var reporter = new ScreenshotReporter();
      reporter.jasmineStarted();

      expect(fs.existsSync('tmp/screenshots')).toEqual(true);
    });

    it('creates a screenshot directory with custom options', function() {
      var reporter = new ScreenshotReporter({
        directory: 'tmp/something/cool'
      });
      reporter.jasmineStarted();

      expect(fs.existsSync('tmp/something/cool')).toEqual(true);
    });
  });

  describe('.specDone()', function() {
    beforeEach(function() { mkdirp.sync('tmp/screenshots'); });

    it('writes a file with default options', function() {
      var reporter = new ScreenshotReporter({
        filename: ':dir/cool-:spec.png'
      });
      reporter.specDone({fullName: 'test'});
      expect(fs.existsSync('tmp/screenshots/cool-test.png')).toEqual(true);
    });

    it('writes a file with default options', function() {
      var reporter = new ScreenshotReporter();
      reporter.specDone({fullName: 'test'});
      expect(fs.existsSync('tmp/screenshots/test.png')).toEqual(true);
    });

    it('escapes non-alphanumeric characters', function() {
      var reporter = new ScreenshotReporter();
      reporter.specDone({fullName: '/test!!'});
      expect(fs.existsSync('tmp/screenshots/test.png')).toEqual(true);
    });
  });
});
