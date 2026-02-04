import template from './live-tail.template.html';

export const name = 'xdslLogsLiveTail';

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
    logServiceGuideLink: '<',
    logKindsKeys: '<',
  },
  template,
};
