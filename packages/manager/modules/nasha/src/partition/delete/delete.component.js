import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    partition: '<',
    serviceName: '<',
    goToPartitionPage: '<',
  },
  controller,
  controllerAs: 'NashaPartitionDeleteCtrl',
  template,
};
