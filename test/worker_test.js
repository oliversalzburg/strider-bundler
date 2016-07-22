'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const bundlerInit = require('../worker.js');

describe('bundler', () => {
  let bundler;

  beforeEach(() => {
    const config = {
      bundleDirectory: 'dist'
    };
    const job = {};
    return bundlerInit.initAsync(config, job)
      .then(result => bundler = result);
  });

  it('should run tar', () => {
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
