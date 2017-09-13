'use strict';

const express = require('express');

const router = express.Router();

const supportParamsMiddleware = require('../../lib/middleware/send-message/params-support');
const campaignParamsMiddleware = require('../../lib/middleware/send-message/params-campaign');
const getConversationMiddleware = require('../../lib/middleware/conversation-get');
const createConversationMiddleware = require('../../lib/middleware/conversation-create');
const campaignMiddleware = require('../../lib/middleware/send-message/campaign');
const supportMiddleware = require('../../lib/middleware/send-message/support');
const loadOutboundSendMessageMiddleware = require('../../lib/middleware/send-message/message-outbound-load');
const createOutboundSendMessageMiddleware = require('../../lib/middleware/send-message/message-outbound-create');

router.use(supportParamsMiddleware());
router.use(campaignParamsMiddleware());

router.use(getConversationMiddleware());
router.use(createConversationMiddleware());

router.use(campaignMiddleware());
router.use(supportMiddleware());

// Load/create outbound message
router.use(loadOutboundSendMessageMiddleware());
router.use(createOutboundSendMessageMiddleware());

module.exports = router;
