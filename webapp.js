'use strict';

module.exports = {
  config: {
    verbose: {type: Boolean, default: true},
    bundleDirectory: {type: String},
    filename: {type: String, default: 'package.tgz'},
    source: {type: String, default: '.'},
    exclude: [
      {type: String}
    ]
  }
};
