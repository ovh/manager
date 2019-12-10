import controller from './custom-snapshot.controller';
import template from './custom-snapshot.html';

export default {
  bindings: {
    serviceName: '<',
    goToPartitionCustomSnapshot: '<',
    goToPartitionPage: '<',
    partition: '<',
  },
  controller,
  controllerAs: 'NashaPartitionCustomSnapshotAddCtrl',
  template,
};
