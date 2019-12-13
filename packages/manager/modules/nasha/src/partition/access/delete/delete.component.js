import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    serviceName: '<',
    partition: '<',
    access: '<',
    goToPartitionAccessPage: '<',
  },
  controller,
  controllerAs: 'NashaPartitionAccessDeleteCtrl',
  template,
};
