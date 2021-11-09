import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    addSnapshotLink: '<',
    deleteSnapshot: '<',
    editSnapshot: '<',
    serviceName: '<',
    snapshots: '<',
    totalSnapshots: '<',
    volumeId: '<',
    snapshotPolicies: '<',
    currentPolicy: '<',
    applyPolicy: '<',
    trackClick: '<',
  },
  controller,
  template,
};
