'use strict';

require('dotenv').config();
const test = require('ava');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const httpMocks = require('node-mocks-http');
const underscore = require('underscore');
const helpers = require('../../../lib/helpers');

const stubs = require('../../helpers/stubs');

chai.should();
chai.use(sinonChai);

// module to be tested
const requestHelper = require('../../../lib/helpers/request');

const campaignId = stubs.getCampaignId();
const userId = stubs.getUserId();

const sandbox = sinon.sandbox.create();

test.beforeEach((t) => {
  sandbox.stub(helpers.analytics, 'addParameters')
    .returns(underscore.noop);
  t.context.req = httpMocks.createRequest();
});

test.afterEach(() => {
  // reset stubs, spies, and mocks
  sandbox.restore();
});

test('parseCampaignKeyword should return trimmed lowercase req.inboundMessageText', () => {
  const text = 'Winter ';
  const trimSpy = sandbox.spy(String.prototype, 'trim');
  const toLowerCaseSpy = sandbox.spy(String.prototype, 'toLowerCase');
  const result = requestHelper.parseCampaignKeyword({ inboundMessageText: text });

  trimSpy.should.have.been.called;
  toLowerCaseSpy.should.have.been.called;
  result.should.equal('winter');
});

test('parseCampaignKeyword should return null when req.inboundMessageText undefined', (t) => {
  const result = requestHelper.parseCampaignKeyword({});
  t.falsy(result);
});

test('setCampaignId should inject a campaignId property to req', (t) => {
  requestHelper.setCampaignId(t.context.req, campaignId);
  t.context.req.campaignId.should.equal(campaignId);
  helpers.analytics.addParameters.should.have.been.calledWith({ campaignId });
});

test('setUserId should inject a userId property to req', (t) => {
  requestHelper.setUserId(t.context.req, userId);
  t.context.req.userId.should.equal(userId);
  helpers.analytics.addParameters.should.have.been.calledWith({ userId });
});
