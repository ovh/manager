import controller from './zfs-options.controller';
import template from './zfs-options.html';

export default {
  bindings: {
    serviceName: '<',
    goToPartitionZfsOptions: '<',
    goToPartitionPage: '<',
    partition: '<',
  },
  controller,
  controllerAs: 'NashaPartitionZFSOptionsCtrl',
  template,
};
