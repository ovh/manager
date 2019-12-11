import controller from './snapshot.controller';
import template from './snapshot.html';

export default {
  bindings: {
    serviceName: '<',
    goToPartitionSnapshot: '<',
    goToPartitionPage: '<',
    partition: '<',
  },
  controller,
  controllerAs: 'NashaPartitionSnapshotCtrl',
  template,
};
