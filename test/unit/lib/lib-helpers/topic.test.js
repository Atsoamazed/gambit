'use strict';

require('dotenv').config();
const test = require('ava');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const graphql = require('../../../../lib/graphql');
const helpers = require('../../../../lib/helpers');
const stubs = require('../../../helpers/stubs');
const broadcastFactory = require('../../../helpers/factories/broadcast');
const topicFactory = require('../../../helpers/factories/topic');
const config = require('../../../../config/lib/helpers/topic');
const repliesConfig = require('../../../../config/lib/helpers/replies');
const templateConfig = require('../../../../config/lib/helpers/template');

chai.should();
chai.use(sinonChai);

// module to be tested
const topicHelper = require('../../../../lib/helpers/topic');

const mockRivescriptTopicId = config.rivescriptTopics.default.id;
const mockDeparsedRivescript = { topics: {} };
mockDeparsedRivescript.topics[mockRivescriptTopicId] = [];
const sandbox = sinon.sandbox.create();

test.beforeEach(() => {
  sandbox.stub(helpers.rivescript, 'getDeparsedRivescript')
    .returns(mockDeparsedRivescript);
});

test.afterEach(() => {
  sandbox.restore();
});

// fetchById
test('fetchById should return graphql.fetchTopicById', async () => {
  const topic = topicFactory.getValidTopic();
  const topicId = topic.id;
  sandbox.stub(graphql, 'fetchTopicById')
    .returns(Promise.resolve(topic));
  sandbox.stub(helpers.cache.topics, 'set')
    .returns(Promise.resolve(topic));
  const result = await topicHelper.fetchById(topicId);
  graphql.fetchTopicById.should.have.been.calledWith(topicId);
  helpers.cache.topics.set.should.have.been.calledWith(topicId);
  result.should.deep.equal(topic);
});

// getById
test('getById should return getRivescriptTopicById if isRivescriptTopicId', async () => {
  const topicId = topicHelper.getDefaultTopicId();
  const result = await topicHelper.getById(topicId);
  result.should.deep.equal(topicHelper.getRivescriptTopicById(topicId));
});

test('getById should return cached topic if not isRivescriptTopicId and is cached', async () => {
  const topic = topicFactory.getValidAutoReply();
  const topicId = stubs.getContentfulId();
  sandbox.stub(helpers.cache.topics, 'get')
    .returns(Promise.resolve(topic));
  sandbox.stub(topicHelper, 'fetchById')
    .returns(Promise.resolve(topic));

  const result = await topicHelper.getById(topicId);
  topicHelper.fetchById.should.not.have.been.called;
  result.should.deep.equal(topic);
});

test('getById should return fetchById if not isRivescriptTopicId and is not cached', async () => {
  const topic = topicFactory.getValidAutoReply();
  const topicId = stubs.getContentfulId();
  sandbox.stub(helpers.cache.topics, 'get')
    .returns(Promise.resolve(null));
  sandbox.stub(topicHelper, 'fetchById')
    .returns(Promise.resolve(topic));

  const result = await topicHelper.getById(topicId);
  result.should.deep.equal(topic);
});

// getDefaultTopic
test('getDefaultTopic should return config.rivescriptTopics.default', () => {
  const result = topicHelper.getDefaultTopic();
  result.should.deep.equal(config.rivescriptTopics.default);
});

// getDefaultTopicId
test('getDefaultTopicId should return config.rivescriptTopics.default.id', (t) => {
  t.is(topicHelper.getDefaultTopicId(), config.rivescriptTopics.default.id);
  t.not(topicHelper.isDefaultTopicId(), stubs.getContentfulId());
});

// getRivescriptTopicById
test('getRivescriptTopicById returns object with type rivescript and given id', () => {
  const result = topicHelper.getRivescriptTopicById(mockRivescriptTopicId);
  result.id.should.equal(mockRivescriptTopicId);
  result.type.should.equal('rivescript');
  result.name.should.equal(mockRivescriptTopicId);
});

// getSupportTopic
test('getSupportTopic should return config.rivescriptTopics.support', () => {
  const result = topicHelper.getSupportTopic();
  result.should.deep.equal(config.rivescriptTopics.support);
});

// getUnsubscribedTopic
test('getUnsubscribedTopic should return config.rivescriptTopics.unsubscribed', () => {
  const result = topicHelper.getUnsubscribedTopic();
  result.should.deep.equal(config.rivescriptTopics.unsubscribed);
});

// hasActiveCampaign
test('hasActiveCampaign returns true if topic has campaign that is not closed', (t) => {
  sandbox.stub(topicHelper, 'hasCampaign')
    .returns(true);
  sandbox.stub(helpers.campaign, 'isClosedCampaign')
    .returns(false);
  const topic = topicFactory.getValidTopic();

  t.truthy(topicHelper.hasActiveCampaign(topic));
  topicHelper.hasCampaign.should.have.been.calledWith(topic);
  helpers.campaign.isClosedCampaign.should.have.been.calledWith(topic.campaign);
});

test('hasActiveCampaign returns false if topic has campaign that is closed', (t) => {
  sandbox.stub(topicHelper, 'hasCampaign')
    .returns(true);
  sandbox.stub(helpers.campaign, 'isClosedCampaign')
    .returns(true);
  const topic = topicFactory.getValidTopic();

  t.falsy(topicHelper.hasActiveCampaign(topic));
});

test('hasActiveCampaign returns false if topic does not have campaign', (t) => {
  sandbox.stub(topicHelper, 'hasCampaign')
    .returns(false);
  sandbox.stub(helpers.campaign, 'isClosedCampaign')
    .returns(false);
  const topic = topicFactory.getValidTopic();

  t.falsy(topicHelper.hasActiveCampaign(topic));
});

// hasCampaign
test('hasCampaign should return boolean of whether topic.campaign.id exists', (t) => {
  t.truthy(topicHelper.hasCampaign(topicFactory.getValidTextPostConfig()));
  t.falsy(topicHelper.hasCampaign(topicFactory.getValidTopicWithoutCampaign()));
});

// hasClosedCampaign
test('hasClosedCampaign returns true if topic has campaign that is closed', (t) => {
  sandbox.stub(topicHelper, 'hasCampaign')
    .returns(true);
  sandbox.stub(helpers.campaign, 'isClosedCampaign')
    .returns(true);
  const topic = topicFactory.getValidTopic();

  t.truthy(topicHelper.hasClosedCampaign(topic));
  topicHelper.hasCampaign.should.have.been.calledWith(topic);
  helpers.campaign.isClosedCampaign.should.have.been.calledWith(topic.campaign);
});

test('hasClosedCampaign returns false if topic has campaign that is not closed', (t) => {
  sandbox.stub(topicHelper, 'hasCampaign')
    .returns(true);
  sandbox.stub(helpers.campaign, 'isClosedCampaign')
    .returns(false);
  const topic = topicFactory.getValidTopic();

  t.falsy(topicHelper.hasClosedCampaign(topic));
});

test('hasClosedCampaign returns false if topic does not have campaign', (t) => {
  sandbox.stub(topicHelper, 'hasCampaign')
    .returns(false);
  sandbox.stub(helpers.campaign, 'isClosedCampaign')
    .returns(true);
  const topic = topicFactory.getValidTopic();

  t.falsy(topicHelper.hasClosedCampaign(topic));
});

// isAskMultipleChoice
test('isAskMultipleChoice returns whether topic type is askMultipleChoice', (t) => {
  t.truthy(topicHelper
    .isAskMultipleChoice(topicFactory.getValidAskMultipleChoiceBroadcastTopic()));
  t.falsy(topicHelper
    .isAskSubscriptionStatus(topicFactory.getValidAskYesNoBroadcastTopic()));
});

// isAskSubscriptionStatus
test('isAskSubscriptionStatus returns whether topic type is askSubscriptionStatus', (t) => {
  t.truthy(topicHelper
    .isAskSubscriptionStatus(topicFactory.getValidAskSubscriptionStatusBroadcastTopic()));
  t.falsy(topicHelper
    .isAskSubscriptionStatus(topicFactory.getValidAskYesNoBroadcastTopic()));
});

// isAskVotingPlanStatus
test('isAskVotingPlanStatus returns whether topic is rivescriptTopics.askVotingPlanStatus', (t) => {
  const mockTopic = topicFactory.getValidTopic();
  const askVotingPlanStatusTopic = topicFactory.getValidAskVotingPlanStatusBroadcastTopic();
  t.truthy(topicHelper.isAskVotingPlanStatus(askVotingPlanStatusTopic));
  t.falsy(topicHelper.isAskVotingPlanStatus(mockTopic));
});

// isAskYesNo
test('isAskYesNo returns whether topic type is askYesNo', (t) => {
  t.truthy(topicHelper.isAskYesNo(broadcastFactory.getValidAskYesNo()));
  t.falsy(topicHelper.isAskYesNo(topicFactory.getValidAutoReply()));
});

// isAutoReply
test('isAutoReply returns whether topic type is autoReply', (t) => {
  t.truthy(topicHelper.isAutoReply(topicFactory.getValidAutoReply()));
  t.falsy(topicHelper.isAutoReply(topicFactory.getValidTextPostConfig()));
});

// isRivescriptTopicId
test('isRivescriptTopicId should return whether topicId exists deparsed rivescript topics', (t) => {
  t.truthy(topicHelper.isRivescriptTopicId(mockRivescriptTopicId));
  t.falsy(topicHelper.isRivescriptTopicId(stubs.getContentfulId()));
});

// isDefaultTopicId
test('isDefaultTopicId should return whether topicId is config.defaultTopicId', (t) => {
  t.truthy(topicHelper.isDefaultTopicId(config.rivescriptTopics.default.id));
  t.falsy(topicHelper.isDefaultTopicId(stubs.getContentfulId()));
});

// isPhotoPostConfig
test('isPhotoPostConfig returns whether topic type is photoPostConfig', (t) => {
  t.truthy(topicHelper.isPhotoPostConfig(topicFactory.getValidPhotoPostConfig()));
  t.falsy(topicHelper.isPhotoPostConfig(topicFactory.getValidAutoReply()));
});

// isTextPostConfig
test('isTextPostConfig returns whether topic type is textPostConfig', (t) => {
  t.truthy(topicHelper.isTextPostConfig(topicFactory.getValidTextPostConfig()));
  t.falsy(topicHelper.isTextPostConfig(topicFactory.getValidAutoReply()));
});

// getTopicTemplateText
test('getTopicTemplateText returns a string when template exists', () => {
  const topic = topicFactory.getValidPhotoPostConfig();
  const templateName = 'startPhotoPostAutoReply';
  const result = topicHelper.getTopicTemplateText(topic, templateName);
  result.should.equal(topic[templateName]);
});

test('getTopicTemplateText throws when template undefined', (t) => {
  const topic = topicFactory.getValidPhotoPostConfig();
  const templateName = 'winterfell';
  t.throws(() => topicHelper.getTopicTemplateText(topic, templateName));
});

// getTransitionTemplateName
test('getTransitionTemplateName returns closedCampaign name if topic hasClosedCampaign', () => {
  sandbox.stub(topicHelper, 'hasClosedCampaign')
    .returns(true);
  const topic = { type: stubs.getRandomWord() };
  const result = topicHelper.getTransitionTemplateName(topic);
  result.should.equal(repliesConfig.campaignClosed.name);
});

test('getTransitionTemplateName returns transitionTemplate if defined in config.types ', () => {
  sandbox.stub(topicHelper, 'hasClosedCampaign')
    .returns(false);
  const topic = topicFactory.getValidTextPostConfig();
  const result = topicHelper.getTransitionTemplateName(topic);
  result.should.equal(config.types.textPostConfig.transitionTemplate);
});

test('getTransitionTemplateName returns rivescript template if config.types undefined', () => {
  sandbox.stub(topicHelper, 'hasClosedCampaign')
    .returns(false);
  const topic = { type: stubs.getRandomWord() };
  const result = topicHelper.getTransitionTemplateName(topic);
  result.should.equal(templateConfig.templatesMap.rivescriptReply);
});
