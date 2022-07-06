import controller from './snapshots.controller';
import template from './snapshots.template.html';

export default {
  bindings: {
    alertError: '<',
    goToDelete: '<',
    nasha: '<',
    partition: '<',
    partitionApiUrl: '<',
    reload: '<',
    snapshots: '<',
    trackTask: '<',
  },
  controller,
  template,
};
