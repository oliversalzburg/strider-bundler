'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const bundlerInit = require('../worker.js');

describe('bundler', () => {
  describe('with directory', () => {
    let bundler;

    before(() => {
      const config = {
        bundleDirectory: 'dist',
        filename: 'package.tgz',
        source: '.'
      };
      const job = {};
      return bundlerInit.initAsync(config, job)
        .then(result => bundler = result);
    });

    it('should run the expected tar command', () => {
      let contextCmd = sinon.stub();
      contextCmd.onFirstCall().callsArg(1);

      const context = {
        comment: Function.prototype,
        cmd: contextCmd
      };

      return bundler.deployAsync(context)
        .then(() => {
          expect(contextCmd).to.have.been.calledWithMatch({
            command: 'tar',
            args: ['--create', '--gzip', '--directory=dist', '--file=package.tgz', '.']
          });
        });
    });
  });

  describe('with verbose', () => {
    let bundler;

    before(() => {
      const config = {
        bundleDirectory: 'dist',
        verbose: true,
        filename: 'package.tgz',
        source: '.'
      };
      const job = {};
      return bundlerInit.initAsync(config, job)
        .then(result => bundler = result);
    });

    it('should run the expected tar command', () => {
      let contextCmd = sinon.stub();
      contextCmd.onFirstCall().callsArg(1);

      const context = {
        comment: Function.prototype,
        cmd: contextCmd
      };

      return bundler.deployAsync(context)
        .then(() => {
          expect(contextCmd).to.have.been.calledWithMatch({
            command: 'tar',
            args: ['--create', '--verbose', '--gzip', '--directory=dist', '--file=package.tgz', '.']
          });
        });
    });
  });

  describe('with exclude', () => {
    let bundler;

    before(() => {
      const config = {
        bundleDirectory: 'dist',
        filename: 'package.tgz',
        source: '.',
        exclude: ['foo']
      };
      const job = {};
      return bundlerInit.initAsync(config, job)
        .then(result => bundler = result);
    });

    it('should run the expected tar command', () => {
      let contextCmd = sinon.stub();
      contextCmd.onFirstCall().callsArg(1);

      const context = {
        comment: Function.prototype,
        cmd: contextCmd
      };

      return bundler.deployAsync(context)
        .then(() => {
          expect(contextCmd).to.have.been.calledWithMatch({
            command: 'tar',
            args: ['--create', '--gzip', '--directory=dist', '--file=package.tgz', '--exclude=foo', '.']
          });
        });
    });
  });
});
