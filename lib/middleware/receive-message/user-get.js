'use strict';

const logger = require('heroku-logger');
const helpers = require('../../helpers');

module.exports = function getNorthstarUser() {
  return (req, res, next) => {
    if (req.platform !== 'sms') {
      return next();
    }

    return req.conversation.getNorthstarUser()
      .then((user) => {
        req.user = user;
        logger.debug('getNorthstarUser', { userId: user.id });

        return next();
      })
      .catch(err => helpers.sendErrorResponse(res, err));
  };
};