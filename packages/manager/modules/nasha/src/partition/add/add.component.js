import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    serviceName: '<',
    goToPartitionPage: '<',
  },
  controller,
  controllerAs: 'NashaPartitionAddCtrl',
  template,
};
