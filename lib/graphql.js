'use strict';

const graphql = require('graphql-request');

const config = require('../config/lib/graphql');

/**
 * Executes a GraphQL query.
 *
 * @param {String} query
 * @param {Object} variables
 * @return {Promise}
 */
function request(query, variables) {
  return graphql.request(`${config.clientOptions.baseURI}/graphql`, query, variables);
}

/**
  * Fetches a broadcast from GraphQL.
  *
  * @param {String} id
  * @return {Promise}
  */
async function fetchBroadcastById(id) {
  const res = await module.exports.request(config.queries.fetchBroadcastById, { id });
  return res.broadcast;
}

/**
 * Fetches all conversation triggers from GraphQL.
 *
 * @return {Promise}
 */
async function fetchConversationTriggers() {
  const res = await module.exports.request(config.queries.fetchConversationTriggers);
  return res.conversationTriggers;
}

/**
  * Fetches a topic from GraphQL.
  *
  * @param {String} id
  * @return {Promise}
  */
async function fetchTopicById(id) {
  const res = await module.exports.request(config.queries.fetchTopicById, { id });
  return res.topic;
}

/**
  * Fetches all web signup confirmations from GraphQL.
  *
  * @return {Promise}
  */
async function fetchWebSignupConfirmations() {
  const res = await module.exports.request(config.queries.fetchWebSignupConfirmations);
  return res.webSignupConfirmations;
}

module.exports = {
  fetchBroadcastById,
  fetchConversationTriggers,
  fetchTopicById,
  fetchWebSignupConfirmations,
  request,
};
