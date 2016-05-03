# Protractor Simple Screenshot Reporter

A simple screenshot reporter for Protractor.

## Usage

1. Install `protractor-simple-screenshot-reporter` locally:

```bash
npm install protractor-simple-screenshot-reporter --save-dev
```

2. Use it in your `protractor.conf.js`:

```javascript
var ScreenshotReporter = require('protractor-simple-screenshot-reporter');

exports.config = {
  ...

  onPrepare: function() {
    jasmine.getEnv().addReporter(new ScreenshotReporter({
      directory: 'tmp/screenshots',
      filename: ':dir/:spec.png'
    }));
  },

  ...
};
```

You can also pass a function to the :filename option:

```javascript
jasmine.getEnv().addReporter(new ScreenshotReporter({
  filename: function(spec) {
    // Group into passed/ and failed/ directories
    return [':dir', spec.status, ':spec.png'].join('/');
  }
}));
```

## TODO

- Support more complex file patterns (eg browser name, timestamp, ect...)
