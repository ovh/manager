import controller from './snapshots.controller';
import template from './snapshots.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    snapshots: '<',
    createVolume: '<',
    createSnapshot: '<',
    deleteSnapshot: '<',
  },
};
