import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    addSnapshotLink: '<',
    deleteSnapshot: '<',
    editSnapshot: '<',
    createVolumeFromSnapshot: '<',
    serviceName: '<',
    snapshots: '<',
    hasOnlySystemSnapshot: '<',
    totalSnapshots: '<',
    volumeId: '<',
    snapshotPolicies: '<',
    currentPolicy: '<',
    applyPolicy: '<',
    trackClick: '<',
    trackCreate: '<',
    goToRestoreSnapshot: '<',
    goToSnapshots: '<',
    canCreateVolumeFromSnapshot: '<',
  },
  controller,
  template,
};
