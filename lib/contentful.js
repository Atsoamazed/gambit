'use strict';

/**
 * Imports.
 */
const contentful = require('contentful');
const Promise = require('bluebird');
const logger = require('heroku-logger');
const underscore = require('underscore');
const NotFoundError = require('../app/exceptions/NotFoundError');

const config = require('../config/lib/contentful');
const Builder = require('./contentfulQueryBuilder');

const ERROR_PREFIX = 'Contentful:';

/**
 * Gets an instance of the contentful query builder
 *
 * @return {QueryBuilder}
 */
module.exports.getQueryBuilder = function getQueryBuilder() {
  return new Builder();
};

/**
 * Setup.
 */
let client;

/**
 * createNewClient
 *
 * @return {Object}  client - Contentful client
 */
module.exports.createNewClient = function createNewClient() {
  try {
    client = contentful.createClient(config.clientOptions);
  } catch (err) {
    // TODO: Log this. Send to Stathat, but alert developers that we're in trouble.
    // @see https://github.com/DoSomething/gambit/issues/714#issuecomment-259838498
    logger.error(exports.contentfulError(err));
  }
  return client;
};

/**
 * getClient - creates and returns a new client if one has not been created.
 *
 * @return {Object}  client
 */
module.exports.getClient = function getClient() {
  if (!client) {
    return exports.createNewClient();
  }
  return client;
};

/**
 * Prefixes Contentful identifier to given error.message.
 */
module.exports.contentfulError = function contentfulError(error) {
  const scope = error;
  scope.message = `${ERROR_PREFIX} ${error.message}`;
  return scope;
};

/**
 * Returns first result of a Contentful getEntries call for the given query.
 */
module.exports.fetchSingleEntry = function fetchSingleEntry(query) {
  return new Promise((resolve, reject) => {
    logger.debug(`contentful.fetchSingleEntry:${JSON.stringify(query)}`);
    return exports.getClient().getEntries(query)
      .then((entries) => {
        const entry = underscore.first(entries.items);
        if (!entry) {
          const error = new NotFoundError('Contentful entry not found.');
          return reject(error);
        }
        return resolve(underscore.first(entries.items));
      })
      .catch(error => reject(exports.contentfulError(error)));
  });
};

function getEntries(query) {
  return new Promise((resolve, reject) => {
    logger.debug(`contentful.fetchSingleEntry:${JSON.stringify(query)}`);
    return exports.getClient().getEntries(query)
      .then(entries => resolve(entries.items))
      .catch(error => reject(exports.contentfulError(error)));
  });
}

/**
 * @param {string} broadcastId
 * @return {Promise}
  */
module.exports.fetchBroadcast = function (broadcastId) {
  logger.debug(`contentful.fetchBroadcast:${broadcastId}`);
  const query = exports.getQueryBuilder()
    .contentfulId(broadcastId)
    .build();
  return exports.fetchSingleEntry(query);
};

/**
 * TODO: Page through results.
 * @see https://github.com/DoSomething/gambit-conversations/issues/197
 * @return {Promise}
 */
module.exports.fetchRivescripts = function () {
  const query = exports.getQueryBuilder()
    .contentType('rivescript')
    .build();
  return getEntries(query);
};
