import controller from './accesses.controller';
import template from './accesses.template.html';

export default {
  bindings: {
    aclTypeEnum: '<',
    alertError: '<',
    goToDelete: '<',
    partition: '<',
    partitionApiUrl: '<',
    trackTasks: '<',
  },
  controller,
  template,
};
