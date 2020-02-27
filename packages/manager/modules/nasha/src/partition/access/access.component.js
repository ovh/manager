import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    access: '<',
    goToPartitionAccessAddPage: '<',
    goToPartitionAccessDeletePage: '<',
    isNew: '<',
    task: '<',
    serviceName: '<',
    partition: '<',
    partitionDetails: '<',
  },
  controller,
  controllerAs: 'NashaPartitionAccessCtrl',
  template,
};
