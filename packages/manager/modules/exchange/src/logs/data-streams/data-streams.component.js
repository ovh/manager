import controller from './data-streams.controller';
import template from './data-streams.template.html';

export const name = 'exchangeLogsDataStreams';

export default {
  bindings: {
    kind: '<',
    url: '<',
    goBack: '<',
    trackClick: '<',
    apiVersion: '<',
    trackingHits: '<',
    logKinds: '<',
    logKindsKeys: '<',
  },
  controller,
  template,
};
