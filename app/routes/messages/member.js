'use strict';

const express = require('express');

const router = express.Router();

// Middleware configs
const getUserConfig = require('../../../config/lib/middleware/messages/member/user-get');
const loadOutboundMessageConfig = require('../../../config/lib/middleware/messages/member/message-outbound');

// Middleware
const paramsMiddleware = require('../../../lib/middleware/messages/member/params');
const getConversationMiddleware = require('../../../lib/middleware/messages/conversation-get');
const createConversationMiddleware = require('../../../lib/middleware/messages/conversation-create');
const getUserMiddleware = require('../../../lib/middleware/messages/user-get');
const createUserIfNotFoundMiddleware = require('../../../lib/middleware/messages/member/user-create');
const loadInboundMessageMiddleware = require('../../../lib/middleware/messages/member/message-inbound-load');
const createInboundMessageMiddleware = require('../../../lib/middleware/messages/member/message-inbound-create');
const loadOutboundMessageMiddleware = require('../../../lib/middleware/messages/message-outbound-load');
const changeTopicMacroMiddleware = require('../../../lib/middleware/messages/member/macro-change-topic');
const replyMacroMiddleware = require('../../../lib/middleware/messages/member/macro-reply');
const badWordsMiddleware = require('../../../lib/middleware/messages/member/bad-words');
const campaignKeywordMiddleware = require('../../../lib/middleware/messages/member/campaign-keyword');
const getRivescriptReplyMiddleware = require('../../../lib/middleware/messages/member/rivescript-reply-get');
const sendRivescriptReplyMiddleware = require('../../../lib/middleware/messages/member/rivescript-reply-send');
const updateUserMiddleware = require('../../../lib/middleware/messages/member/user-update');
const supportRequestedMiddleware = require('../../../lib/middleware/messages/member/support-requested');
const forwardSupportMessageMiddleware = require('../../../lib/middleware/messages/member/support-message');
const menuMacroMiddleware = require('../../../lib/middleware/messages/member/macro-menu');
const getTopicMiddleware = require('../../../lib/middleware/messages/member/topic-get');
const catchAllMiddleware = require('../../../lib/middleware/messages/member/catch-all');

router.use(paramsMiddleware());

// Get or create user for conversation.
router.use(getUserMiddleware(getUserConfig));
router.use(createUserIfNotFoundMiddleware());

// Load/create conversation.
router.use(getConversationMiddleware());
router.use(createConversationMiddleware());

// Get the Rivescript bot reply to the text sent from user.
router.use(getRivescriptReplyMiddleware());

// Checks if this is a retry request, and loads inbound message if it exists already.
router.use(loadInboundMessageMiddleware());

// Creates inbound message from user.
router.use(createInboundMessageMiddleware());

// Checks if this is a retry request, and loads outbound reply message if it exists already.
router.use(loadOutboundMessageMiddleware(loadOutboundMessageConfig));

// Updates Last Messaged At, Subscription Status, Paused.
router.use(updateUserMiddleware());

// If bot reply is a changeTopic macro, execute it.
router.use(changeTopicMacroMiddleware());

// If bot reply is a macro with hardcoded reply message, send the reply.
router.use(replyMacroMiddleware());

// Scolds User if inbound message contains bad words.
router.use(badWordsMiddleware());

// If MENU keyword, set random Campaign and ask for Signup.
router.use(menuMacroMiddleware());

// TODO: This won't be used once we publish defaultTopicTrigger entries with topic responses.
// If Campaign keyword was sent, update Conversation campaign and send continueCampaign.
router.use(campaignKeywordMiddleware());

// If Conversation is paused, forward inbound messages to Front, for agents to respond to.
// Sends an empty reply message back.
router.use(forwardSupportMessageMiddleware());

// Sends the reply text returned by Rivescript.
router.use(sendRivescriptReplyMiddleware());

// Otherwise, fetch the current conversation topic.
router.use(getTopicMiddleware());

// TODO: Why is this here and nor further up. Let's just combine into one middleware.
// If QUESTION keyword, pause Conversation and prompt User to send their support question.
router.use(supportRequestedMiddleware());

// Determines whether to start or continue conversation for the current topic.
router.use(catchAllMiddleware());

module.exports = router;
