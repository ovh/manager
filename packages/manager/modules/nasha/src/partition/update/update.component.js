import controller from './update.controller';
import template from './update.html';

export default {
  bindings: {
    serviceName: '<',
    goToPartitionUpdate: '<',
    goToPartitionPage: '<',
    partition: '<',
  },
  controller,
  controllerAs: 'NashaPartitionUpdateCtrl',
  template,
};
