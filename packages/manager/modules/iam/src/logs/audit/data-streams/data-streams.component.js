import controller from './data-streams.controller';
import template from './data-streams.template.html';

export const name = 'iamAuditLogsDataStreams';

export default {
  bindings: {
    kind: '<',
    goBack: '<',
    trackClick: '<',
    apiVersion: '<',
  },
  controller,
  template,
};
