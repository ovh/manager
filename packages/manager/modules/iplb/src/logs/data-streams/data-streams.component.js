import controller from './data-streams.controller';
import template from './data-streams.template.html';

export const name = 'iplbLogsDataStreams';

export default {
  bindings: {
    kind: '<',
    url: '<',
    goBack: '<',
    trackClick: '<',
    apiVersion: '<',
    trackingHits: '<',
    logKinds: '<',
  },
  controller,
  template,
};
