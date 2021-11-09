import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBackToSnapshotPolicies: '<',
    serviceName: '<',
    trackClick: '<',
  },
  controller,
  template,
};
