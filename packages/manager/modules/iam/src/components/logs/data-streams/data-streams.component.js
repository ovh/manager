import controller from './data-streams.controller';
import template from './data-streams.template.html';

export const name = 'iamLogsDataStreams';

export default {
  bindings: {
    kind: '<',
    url: '<',
    goBack: '<',
    trackClick: '<',
    apiVersion: '<',
  },
  controller,
  template,
};
