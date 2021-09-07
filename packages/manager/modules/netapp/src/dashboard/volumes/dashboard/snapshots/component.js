import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    addSnapshotLink: '<',
    deleteSnapshot: '<',
    serviceName: '<',
    snapshots: '<',
    totalSnapshots: '<',
    volumeId: '<',
  },
  controller,
  template,
};
