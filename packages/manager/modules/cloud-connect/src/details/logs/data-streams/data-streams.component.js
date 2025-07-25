import template from './data-streams.template.html';

export const name = 'cloudConnectLogsDataStreams';

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
