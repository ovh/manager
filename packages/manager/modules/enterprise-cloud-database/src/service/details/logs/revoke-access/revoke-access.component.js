import controller from './revoke-access.controller';
import template from './revoke-access.html';

const component = {
  template,
  controller,
  bindings: {
    clusterId: '<',
    goBackToLogs: '<',
    logId: '<',
    ldpAccount: '<',
  },
};

export default component;
