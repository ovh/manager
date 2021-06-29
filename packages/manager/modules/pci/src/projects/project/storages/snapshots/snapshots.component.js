import controller from './snapshots.controller';
import template from './snapshots.html';

export default {
  controller,
  template,
  bindings: {
    createSnapshot: '<',
    createVolume: '<',
    deleteSnapshot: '<',
    guideUrl: '<',
    onListParamChange: '<',
    projectId: '<',
    snapshotId: '<',
    snapshots: '<',
  },
};
