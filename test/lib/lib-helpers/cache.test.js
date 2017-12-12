'use strict';

require('dotenv').config();
const test = require('ava');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const logger = require('heroku-logger');
const rewire = require('rewire');

const stubs = require('../../helpers/stubs');

// setup "x.should.y" assertion style
chai.should();
chai.use(sinonChai);

// module to be tested
const cacheHelper = rewire('../../../lib/helpers/cache');

const broadcastId = stubs.getBroadcastId();
const broadcastStats = stubs.getBroadcastStats();

// sinon sandbox object
const sandbox = sinon.sandbox.create();

// Setup!
test.beforeEach(() => {
  stubs.stubLogger(sandbox, logger);
});

// Cleanup!
test.afterEach(() => {
  // reset stubs, spies, and mocks
  sandbox.restore();
  // reset statsCache on each test
  cacheHelper.__set__('broadcastStatsCache', undefined);
});

test('getStatsCacheForBroadcastId should return object when stats cache exists', async () => {
  cacheHelper.__set__('broadcastStatsCache', {
    get: () => Promise.resolve(broadcastStats),
  });
  const result = await cacheHelper.getStatsCacheForBroadcastId(broadcastId);
  result.should.deep.equal(broadcastStats);
});

test('getStatsCacheForBroadcastId should return falsy when stats cache undefined', async (t) => {
  cacheHelper.__set__('broadcastStatsCache', {
    get: () => Promise.resolve(null),
  });
  const result = await cacheHelper.getStatsCacheForBroadcastId(broadcastId);
  t.falsy(result);
});

test('getStatsCacheForBroadcastId should throw when statsCache.get fails', async (t) => {
  cacheHelper.__set__('broadcastStatsCache', {
    get: () => Promise.reject(new Error()),
  });
  await t.throws(cacheHelper.getStatsCacheForBroadcastId(broadcastId));
});

test('setStatsCacheForBroadcastId should return an object', async () => {
  cacheHelper.__set__('broadcastStatsCache', {
    set: () => Promise.resolve(broadcastStats),
  });
  const result = await cacheHelper.setStatsCacheForBroadcastId(broadcastId);
  result.should.deep.equal(broadcastStats);
});

test('setStatsCacheForBroadcastId should throw if statsCache.set fails', async (t) => {
  cacheHelper.__set__('broadcastStatsCache', {
    set: () => Promise.reject(new Error()),
  });
  await t.throws(cacheHelper.setStatsCacheForBroadcastId(broadcastId));
});
