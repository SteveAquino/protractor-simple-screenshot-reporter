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
    describe('if config.resetEachRun = true', function() {
      it('removes the screenshot directory', function() {
        var reporter = new ScreenshotReporter({resetEachRun: true});
        mkdirp.sync('tmp/screenshots');
        reporter.jasmineStarted();
        expect(fs.existsSync('tmp/screenshots')).toEqual(false);
      });
    });
  });

  describe('.specDone()', function() {
    beforeEach(function() { mkdirp.sync('tmp/screenshots'); });

    it('writes a file with default options', function() {
      var reporter = new ScreenshotReporter();
      reporter.specDone({fullName: 'test'});
      expect(fs.existsSync('tmp/screenshots/test.png')).toEqual(true);
    });

    it('writes a file with a custom :filename pattern', function() {
      var reporter = new ScreenshotReporter({
        filename: ':dir/cool-:spec.png'
      });
      reporter.specDone({fullName: 'test'});
      expect(fs.existsSync('tmp/screenshots/cool-test.png')).toEqual(true);
    });

    it('writes a file with a custom :filename function', function() {
      var reporter = new ScreenshotReporter({
        filename: function(spec) {
          return ':dir/dynamic/' + spec.fullName + '.png';
        }
      });
      reporter.specDone({fullName: 'test'});
      expect(fs.existsSync('tmp/screenshots/dynamic/test.png')).toEqual(true);
    });

    it('escapes non-alphanumeric characters', function() {
      var reporter = new ScreenshotReporter();
      reporter.specDone({fullName: '/test!!'});
      expect(fs.existsSync('tmp/screenshots/test.png')).toEqual(true);
    });
  });
});
