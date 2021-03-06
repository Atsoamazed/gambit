'use strict';

const express = require('express');

const router = express.Router();

// Middleware configs
const getUserConfig = require('../../../config/lib/middleware/messages/user-get');
const outboundMessageConfig = require('../../../config/lib/middleware/messages/signup/message-outbound');

// Middleware
const paramsMiddleware = require('../../../lib/middleware/messages/signup/params');
const getUserMiddleware = require('../../../lib/middleware/messages/user-get');
const validateOutboundMessageMiddleware = require('../../../lib/middleware/messages/message-outbound-validate');
const getConversationMiddleware = require('../../../lib/middleware/messages/conversation-get');
const createConversationMiddleware = require('../../../lib/middleware/messages/conversation-create');
const getWebSignupConfirmationMiddleware = require('../../../lib/middleware/messages/signup/web-signup-confirmation-get');
const updateConversationMiddleware = require('../../../lib/middleware/messages/signup/conversation-update');
const loadOutboundMessageMiddleware = require('../../../lib/middleware/messages/message-outbound-load');
const createOutboundMessageMiddleware = require('../../../lib/middleware/messages/message-outbound-create');
const sendOutboundMessageMiddleware = require('../../../lib/middleware/messages/message-outbound-send');

router.use(paramsMiddleware());

// Fetch web signup confirmation for campaignId param.
router.use(getWebSignupConfirmationMiddleware());
// Fetch user for userId param.
router.use(getUserMiddleware(getUserConfig));
router.use(validateOutboundMessageMiddleware(outboundMessageConfig));

// Find or create conversation for user.
router.use(getConversationMiddleware());
router.use(createConversationMiddleware());
// Set the conversation campaign.
router.use(updateConversationMiddleware());

// Send signup message.
router.use(loadOutboundMessageMiddleware(outboundMessageConfig));
router.use(createOutboundMessageMiddleware(outboundMessageConfig));
router.use(sendOutboundMessageMiddleware());

module.exports = router;
