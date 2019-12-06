import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    isNew: '<',
    goToPartitionAdd: '<',
    goToPartitionCustomSnapshot: '<',
    goToPartitionDelete: '<',
    goToPartitionPage: '<',
    goToPartitionSnapshot: '<',
    goToPartitionUpdate: '<',
    goToPartitionZfsOptions: '<',
    partition: '<',
    serviceName: '<',
    tasks: '<',
  },
  controller,
  controllerAs: 'NashaPartitionCtrl',
  template,
};
