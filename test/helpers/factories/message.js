'use strict';

const ObjectID = require('mongoose').Types.ObjectId;
const Message = require('../../../app/models/Message');
const stubs = require('../stubs');

module.exports.getValidMessage = function getValidMessage(direction) {
  const id = new ObjectID();
  const date = new Date();
  return new Message({
    _id: id,
    createdAt: date,
    updatedAt: date,
    text: stubs.getRandomMessageText(),
    direction: direction || 'inbound',
  });
};

module.exports.getValidOutboundReplyMessage = function getValidOutboundReplyMessage() {
  return exports.getValidMessage('outbound-reply');
};