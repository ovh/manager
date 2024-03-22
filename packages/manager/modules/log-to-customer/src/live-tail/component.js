import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    serviceDescription: '?serviceDescription',
  },
  bindings: {
    logsDescription: '<',
    logApiUrl: '<',
    logServiceGuideLink: '<',
    logSubscriptionUrl: '<',
    goToListingPage: '<',
    logKindsList: '<',
    kindInitValue: '<',
  },
};
