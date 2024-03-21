import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    tileDescription: '?tileDescription',
  },
  bindings: {
    kind: '<',
    logSubscriptionUrl: '<',
    goToListingPage: '<',
    trackClick: '<',
    trackingHits: '<',
  },
};
