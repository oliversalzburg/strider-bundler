'use strict';

const Promise = require('bluebird');

const debug = require('debug')('strider-bundler:worker');
const ExtensionConfigurationError = require('strider-modern-extensions').errors.ExtensionConfigurationError;
const toStriderProxy = require('strider-modern-extensions').toStriderProxy;

class BundlerPhaseWorker {
  constructor(config, job) {
    debug('Constructing phase worker for strider-bundler…');

    this.config = config || {};
    this.job = job;

    // Example: Setting an environment variable
    this.env = {
      'BUNDLER_ACTIVE': true
    };

    // Example: Static command definition for a phase
    this.environment = 'echo This job will be processed by strider-bundler';
  }

  // Run this function in the deploy phase.
  deploy(context) {
    debug('Starting bundling process…');
    context.comment('Starting bundling process…');

    const contextCmd = Promise.promisify(context.cmd);

    const args = [];
    // Create an archive
    args.push('--create');
    // Set verbose as requested.
    if (this.config.verbose) {
      args.push('--verbose');
    }
    // Compress it
    args.push('--gzip');
    // If a directory was given, archive that (otherwise cwd)
    if (this.config.bundleDirectory) {
      args.push(`--directory=${this.config.bundleDirectory}`);
    }
    // Set the output filename
    args.push('--file=package.tgz');

    if (this.config.exclude && this.config.exclude.length) {
      this.config.exclude.forEach(exclude => {
        args.push(`--exclude=${exclude}`);
      });
    }

    args.push('.');

    return contextCmd({
      command: 'tar',
      args: args
    })
      .then(() => {
        context.comment('Bundle created as package.tgz.');
      });
  }
}

class BundlerInit {
  //noinspection JSUnusedGlobalSymbols
  init(config, job) {
    debug('Initializing strider-bundler…');

    if (!config.source) {
      throw new ExtensionConfigurationError('bundleDirectory', 'The configuration is expected to contain a \'bundleDirectory\' member that contains the path which should be bundled.');
    }
    if (config.exclude && !Array.isArray(config.exclude)) {
      throw new ExtensionConfigurationError('exclude', 'The configuration member \'exclude\' is expected to contain an array of strings..');
    }

    return Promise.resolve(toStriderProxy(new BundlerPhaseWorker(config, job)));
  }
}

module.exports = toStriderProxy(new BundlerInit());
