import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToPartitionAccessAddPage: '<',
    goToPartitionAccessDeletePage: '<',
  },
  controller,
  controllerAs: 'NashaPartitionAccessCtrl',
  template,
};
