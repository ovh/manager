import controller from './home.controller';
import template from './home.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    trackingPrefix: '<',
    homeAIGuides: '<',
    aiItems: '<',
    aiUsers: '<',
    aiTokens: '<',
    billing: '<',
    goToObjectStorage: '<',
    goToAINotebooks: '<',
    goToAITraining: '<',
    goToAIDeploy: '<',
    goToBilling: '<',
    goToUsersAndTokens: '<',
  },
};
