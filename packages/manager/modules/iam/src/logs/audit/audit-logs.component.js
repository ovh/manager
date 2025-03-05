import template from './audit-logs.template.html';
import controller from './audit-logs.controller';

export const name = 'iamAuditLogs';

export default {
  bindings: {
    goToListingPage: '<',
    logKinds: '<',
    kind: '<',
    trackClick: '<',
    apiVersion: '<',
  },
  template,
  controller,
};
