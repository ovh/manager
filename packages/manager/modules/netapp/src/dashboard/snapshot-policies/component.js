import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToCreateSnapshotPolicies: '<',
    getSnapshotPolicies: '<',
    serviceName: '<',
    snapshotPolicies: '<',
    trackClick: '<',
  },
  controller,
  template,
};
