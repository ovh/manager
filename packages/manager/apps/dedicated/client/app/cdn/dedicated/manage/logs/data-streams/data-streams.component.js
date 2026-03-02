import template from './data-streams.template.html';

export const name = 'cdnDedicatedLogsDataStreams';

export default {
  bindings: {
    kind: '<',
    url: '<',
    goBack: '<',
    trackClick: '<',
    apiVersion: '<',
    trackingHits: '<',
    logKinds: '<',
    logSubscriptionApiData: '=',
  },
  template,
};
