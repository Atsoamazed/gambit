'use strict';

const helpers = require('../../../../../../helpers');
const logger = require('../../../../../../logger');

/**
 * This middleware is step 4 of 4 for photo post creation: saving whyParticipated to draft, but only
 * if a value doesn't exist on the user's signup for the campaign.
 *
 * Calls next to submit a photo post with the completed draft values.
 */
const whyParticipatedKey = helpers.topic.getPhotoPostDraftSubmissionValuesMap().whyParticipated;

module.exports = function draftWhyParticipated() {
  return async (req, res, next) => {
    try {
      if (!helpers.topic.isPhotoPostConfig(req.topic)) {
        return next();
      }

      // If property exists on signup already, call next to create a new photo post from draft.
      if (await helpers.request.hasSignupWithWhyParticipated(req)) {
        logger.debug('signup hasWhyParticipated', {}, req);
        return next();
      }

      /**
       * If we have a draft value saved and we're here, we don't need to be, as this middleware is
       * for saving the field to draft.
       * This is a retry request --  call next to create a new photo post from draft.
       */
      if (helpers.request.hasDraftSubmissionValue(req, whyParticipatedKey)) {
        return next();
      }

      if (helpers.util.isValidTextFieldValue(req.inboundMessageText)) {
        await helpers.request
          .saveDraftSubmissionValue(req, whyParticipatedKey, req.inboundMessageText);
        return next();
      }

      return await helpers.replies.invalidWhyParticipated(req, res);
    } catch (err) {
      return helpers.sendErrorResponse(res, err);
    }
  };
};
