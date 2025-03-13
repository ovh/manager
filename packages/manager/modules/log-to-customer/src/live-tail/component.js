import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    mainDescription: '?mainDescription',
  },
  bindings: {
    logApiUrl: '<',
    logServiceGuideLink: '<',
    logSubscriptionUrl: '<',
    apiVersion: '<?',
    goToListingPage: '<',
    logKindsList: '<',
    logKindsKeys: '<',
    kindInitValue: '<',
    trackClick: '<',
    trackingHits: '<',
  },
};
