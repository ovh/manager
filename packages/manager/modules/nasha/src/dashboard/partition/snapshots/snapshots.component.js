import controller from './snapshots.controller';
import template from './snapshots.template.html';

export default {
  bindings: {
    alertError: '<',
    customSnapshots: '<',
    goToDelete: '<',
    nasha: '<',
    partition: '<',
    partitionApiUrl: '<',
    reload: '<',
    snapshotEnum: '<',
    snapshotTypes: '<',
    goToTrackTasks: '<',
  },
  controller,
  template,
};
