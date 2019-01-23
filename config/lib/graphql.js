'use strict';

const campaignFields = `
  campaign {
    id
    endDate
    internalTitle
  }
`;

const fetchConversationTriggers = `
  query getConversationTriggers {
    conversationTriggers {
      trigger
      reply
      topic {
        id
        ... on AutoReplySignupTopic {
          ${campaignFields}
        }
        ... on PhotoPostTopic {
          ${campaignFields}
        }
        ... on TextPostTopic {
          ${campaignFields}
        }
      }
    }
  }
`;

const fetchTopicById = `
  query getTopicById($id: String!) {
    topic(id: $id) {
      id
      contentType
      ... on AskYesNoBroadcastTopic {
        invalidAskYesNoResponse
        saidNo
        saidNoTopic {
          id
        }
        saidYes
        saidYesTopic {
          id
          ...autoReplySignupCampaign
          ...photoPostCampaign
          ...textPostCampaign
        }
      }
      ... on AutoReplySignupTopic {
        ...autoReplySignupCampaign
        autoReply
      }
      ... on AutoReplyTopic {
        autoReply
      }
      ... on PhotoPostTopic {
        ...photoPostCampaign
        askCaption
        askPhoto
        askQuantity
        askWhyParticipated
        invalidCaption
        invalidPhoto
        invalidQuantity
        invalidWhyParticipated
        completedPhotoPost
        completedPhotoPostAutoReply
        startPhotoPostAutoReply
      }
      ... on TextPostTopic {
        ...textPostCampaign
        invalidText
        completedTextPost
      }
    }
  }
  fragment autoReplySignupCampaign on AutoReplySignupTopic {
    ${campaignFields}
  }
  fragment photoPostCampaign on PhotoPostTopic {
    ${campaignFields}
  }
  fragment textPostCampaign on TextPostTopic {
    ${campaignFields}
  }
`;

module.exports = {
  queries: {
    fetchConversationTriggers,
    fetchTopicById,
  },
  url: process.env.DS_GRAPHQL_API_BASEURI,
};
