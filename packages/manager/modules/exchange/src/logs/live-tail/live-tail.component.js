import template from './live-tail.template.html';
import controller from './live-tail.controller';

export const name = 'exchangeLogsLiveTail';

export default {
  bindings: {
    goToListingPage: '<',
    logKinds: '<',
    logKindsKeys: '<',
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
