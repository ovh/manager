import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    serviceDescription: '?serviceDescription',
  },
  bindings: {
    setErrorMessage: '<',
    kind: '<',
    logSubscriptionUrl: '<',
    goToListingPage: '<',
    trackClick: '<',
    trackingHits: '<',
  },
};
