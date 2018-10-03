'use strict';

const profile = require('./user').fields;
const rivescriptTopics = require('./topic').rivescriptTopics;

const defaultTopic = rivescriptTopics.default;
const invalidAnswerText = 'Sorry, I didn\'t get that.';

// Subscription status.
const activeSubscriptionStatusText = 'Hi I\'m Freddie from DoSomething.org! Welcome to my weekly updates (up to 8msg/month). Things to know: Msg&DataRatesApply. Text HELP for help, text STOP to stop.';
const askSubscriptionStatusText = 'Do you want texts: A)Weekly B)Monthly C)I need more info';
const newsUrl = 'https://www.dosomething.org/us/spot-the-signs-guide?source=sms&utm_source=dosomething&utm_medium=sms&utm_campaign=permissioning_weekly&user_id={{user.id}}';

// Voting plan.
const askVotingPlanAttendingWithText = 'Who are you planning on voting with A) Alone B) Friends C) Family D) Co-workers';
const askVotingPlanMethodOfTransportText = 'How are you getting there? A) Drive B) Walk C) Bike D) Public transportation';
const askVotingPlanStatusText = 'Are you planning on voting? A) Yes B) No C) Already voted D) Can\'t vote';
const askVotingPlanTimeOfDayText = 'What time are you planning on voting? A) Morning B) Afternoon C) Evening';
// The votingPlanStatusVoting macro begins collecting voting plan data via topic changes:
// 1 - askVotingPlanTimeOfDay
// 2 - askVotingPlanAttendingWith
// 3 - askVotingPlanMethodOfTransport
// 4 - completed
const beginVotingPlanText = `Let's make a plan! ${askVotingPlanTimeOfDayText}`;
const beginVotingPlanTopic = rivescriptTopics.askVotingPlanTimeOfDay;
const completedVotingPlanText = 'Thanks for making the plan, we’ll remind you tomorrow.';
/**
 * @param {String} macroName
 * @param {String} valueKey
 * @return {Object}
 */
function votingPlanTimeOfDay(macroName, valueKey) {
  return {
    name: macroName,
    // After saving time of day, ask for attending with.
    text: askVotingPlanAttendingWithText,
    topic: rivescriptTopics.askVotingPlanAttendingWith,
    profileUpdate: {
      field: profile.votingPlanTimeOfDay.name,
      value: profile.votingPlanTimeOfDay.values[valueKey],
    },
  };
}

/**
 * @param {String} macroName
 * @param {String} valueKey
 * @return {Object}
 */
function votingPlanAttendingWith(macroName, valueKey) {
  return {
    name: macroName,
    // After saving attending with, ask for method of transport.
    text: askVotingPlanMethodOfTransportText,
    topic: rivescriptTopics.askVotingPlanMethodOfTransport,
    profileUpdate: {
      field: profile.votingPlanAttendingWith.name,
      value: profile.votingPlanAttendingWith.values[valueKey],
    },
  };
}

/**
 * @param {String} macroName
 * @param {String} valueKey
 * @return {Object}
 */
function votingPlanMethodOfTransport(macroName, valueKey) {
  return {
    name: macroName,
    // After saving method of transport, the voting plan is complete.
    text: completedVotingPlanText,
    topic: defaultTopic,
    profileUpdate: {
      field: profile.votingPlanMethodOfTransport.name,
      value: profile.votingPlanMethodOfTransport.values[valueKey],
    },
  };
}

module.exports = {
  // If a macro contains a text property, it's sent as the reply to the inbound message.
  // If it doesn't, the reply text is sourced from the current topic.
  macros: {
    askVotingPlanStatus: {
      name: 'askVotingPlanStatus',
      text: askVotingPlanStatusText,
      topic: rivescriptTopics.askVotingPlanStatus,
    },
    askSubscriptionStatus: {
      name: 'askSubscriptionStatus',
      text: askSubscriptionStatusText,
      topic: rivescriptTopics.askSubscriptionStatus,
    },
    catchAll: {
      name: 'catchAll',
    },
    changeTopic: {
      name: 'changeTopic',
    },
    invalidSubscriptionStatus: {
      name: 'invalidSubscriptionStatus',
      text: `${invalidAnswerText} ${askSubscriptionStatusText}`,
    },
    invalidVotingPlanAttendingWith: {
      name: 'invalidVotingPlanAttendingWith',
      text: `${invalidAnswerText} ${askVotingPlanAttendingWithText}`,
    },
    invalidVotingPlanMethodOfTransport: {
      name: 'invalidVotingPlanMethodOfTransport',
      text: `${invalidAnswerText} ${askVotingPlanMethodOfTransportText}`,
    },
    invalidVotingPlanStatus: {
      name: 'invalidVotingPlanStatus',
      text: `${invalidAnswerText} ${askVotingPlanStatusText}`,
    },
    invalidVotingPlanTimeOfDay: {
      name: 'invalidVotingPlanTimeOfDay',
      text: `${invalidAnswerText} ${askVotingPlanTimeOfDayText}`,
    },
    noReply: {
      name: 'noReply',
      text: '',
    },
    saidNo: {
      name: 'saidNo',
    },
    saidYes: {
      name: 'saidYes',
    },
    sendCrisisMessage: {
      name: 'sendCrisisMessage',
      text: 'Thanks for being brave and sharing that. If you want to talk to someone, our friends at CTL are here for you 24/7. Just send a text to 741741. They\'ll listen!',
    },
    sendInfoMessage: {
      name: 'sendInfoMessage',
      text: 'These are Do Something Alerts - 4 messages/mo. Info help@dosomething.org or http://doso.me/1jf4/291kep. Txt STOP to quit. Msg&Data Rates May Apply.',
    },
    subscriptionStatusActive: {
      name: 'subscriptionStatusActive',
      text: activeSubscriptionStatusText,
      topic: defaultTopic,
      profileUpdate: {
        field: profile.subscriptionStatus.name,
        value: profile.subscriptionStatus.values.active,
      },
    },
    subscriptionStatusLess: {
      name: 'subscriptionStatusLess',
      text: `Okay, great! I'll text you once a month with updates on what's happening in the news and/or easy ways for you to take action in your community! Wanna take 2 mins to learn how to spot the signs of an abusive relationship and what you can do about it? Read our guide here: ${newsUrl}`,
      topic: defaultTopic,
      profileUpdate: {
        field: profile.subscriptionStatus.name,
        value: profile.subscriptionStatus.values.less,
      },
    },
    subscriptionStatusNeedMoreInfo: {
      name: 'subscriptionStatusNeedMoreInfo',
      text: `Sure! Once a week, I text over 3 million young people with updates on what's happening in the news and/or easy ways to take action in your community.\n\nWant an example of an easy way to take action? Take 2 mins to learn how to spot the signs of an abusive relationship and what you can do about it. Read our guide: ${newsUrl}`,
    },
    subscriptionStatusResubscribed: {
      name: 'subscriptionStatusResubscribed',
      text: activeSubscriptionStatusText,
      topic: defaultTopic,
      profileUpdate: {
        field: profile.subscriptionStatus.name,
        value: profile.subscriptionStatus.values.active,
      },
    },
    subscriptionStatusStop: {
      name: 'subscriptionStatusStop',
      text: 'You\'re unsubscribed from DoSomething.org Alerts. No more msgs will be sent. Reply HELP for help. Text JOIN to receive 4-8 msgs/mth or LESS for 1msg/mth.',
      topic: rivescriptTopics.unsubscribed,
      profileUpdate: {
        field: profile.subscriptionStatus.name,
        value: profile.subscriptionStatus.values.stop,
      },
    },
    supportRequested: {
      name: 'supportRequested',
      text: 'What\'s your question? I\'ll try my best to answer it.',
      topic: rivescriptTopics.support,
    },
    votingPlanAttendingWithAlone: votingPlanAttendingWith('votingPlanAttendingWithAlone', 'alone'),
    votingPlanAttendingWithCoWorkers: votingPlanAttendingWith('votingPlanAttendingWithCoWorkers', 'coWorkers'),
    votingPlanAttendingWithFamily: votingPlanAttendingWith('votingPlanAttendingWithFamily', 'family'),
    votingPlanAttendingWithFriends: votingPlanAttendingWith('votingPlanAttendingWithFriends', 'friends'),
    votingPlanMethodOfTransportBike: votingPlanMethodOfTransport('votingPlanMethodOfTransportBike', 'bike'),
    votingPlanMethodOfTransportDrive: votingPlanMethodOfTransport('votingPlanMethodOfTransportDrive', 'drive'),
    votingPlanMethodOfTransportPublicTransport: votingPlanMethodOfTransport('votingPlanMethodOfTransportPublicTransport', 'publicTransport'),
    votingPlanMethodOfTransportWalk: votingPlanMethodOfTransport('votingPlanMethodOfTransportWalk', 'walk'),
    votingPlanStatusCantVote: {
      name: 'votingPlanStatusCantVote',
      // Placeholder text and topic, these will be set via askVotingPlanStatus topic.
      text: 'Ok -- we\'ll check in with you next election.',
      topic: defaultTopic,
      profileUpdate: {
        field: profile.votingPlanStatus.name,
        value: profile.votingPlanStatus.values.cantVote,
      },
    },
    votingPlanStatusNotVoting: {
      name: 'votingPlanStatusNotVoting',
      // Placeholder text and topic, these will be set via askVotingPlanStatus topic.
      text: 'Mind sharing why you aren\'t not voting?',
      topic: defaultTopic,
      profileUpdate: {
        field: profile.votingPlanStatus.name,
        value: profile.votingPlanStatus.values.notVoting,
      },
    },
    votingPlanStatusVoted: {
      name: 'votingPlanStatusVoted',
      // Placeholder text and topic, these will be set via askVotingPlanStatus topic.
      text: 'Awesome! Thank you for voting.',
      topic: defaultTopic,
      profileUpdate: {
        field: profile.votingPlanStatus.name,
        value: profile.votingPlanStatus.values.voted,
      },
    },
    votingPlanStatusVoting: {
      name: 'votingPlanStatusVoting',
      text: beginVotingPlanText,
      topic: beginVotingPlanTopic,
      profileUpdate: {
        field: profile.votingPlanStatus.name,
        value: profile.votingPlanStatus.values.voting,
      },
    },
    votingPlanTimeOfDayAfternoon: votingPlanTimeOfDay('votingPlanTimeOfDayAfternoon', 'afternoon'),
    votingPlanTimeOfDayEvening: votingPlanTimeOfDay('votingPlanTimeOfDayEvening', 'evening'),
    votingPlanTimeOfDayMorning: votingPlanTimeOfDay('votingPlanTimeOfDayMorning', 'morning'),
  },
};
