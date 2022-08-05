import controller from './snapshots.controller';
import template from './snapshots.template.html';

export default {
  bindings: {
    alertError: '<',
    customSnapshots: '<',
    goToDelete: '<',
    partition: '<',
    partitionApiUrl: '<',
    snapshotEnum: '<',
    snapshotTypes: '<',
    goToTrackTasks: '<',
    trackClick: '<',
  },
  controller,
  template,
};
