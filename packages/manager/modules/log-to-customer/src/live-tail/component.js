import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    tileDescription: '?tileDescription',
    mainDescription: '?mainDescription',
  },
  bindings: {
    logApiUrl: '<',
    logServiceGuideLink: '<',
    logSubscriptionUrl: '<',
    goToListingPage: '<',
    logKindsList: '<',
    kindInitValue: '<',
    trackClick: '<',
    trackingHits: '<',
  },
};
