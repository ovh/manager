import template from './live-tail.template.html';
import controller from './live-tail.controller';

export const name = 'iamLogsLiveTail';

export default {
  bindings: {
    goToListingPage: '<',
    logKinds: '<',
    kind: '<',
    trackClick: '<',
    apiVersion: '<',
    trackingHits: '<',
    url: '<',
    description: '@',
  },
  template,
  controller,
};
