import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  bindings: {
    kind: '<',
    logSubscriptionUrl: '<',
    goToListingPage: '<',
    trackClick: '<',
    trackingHits: '<',
  },
};
