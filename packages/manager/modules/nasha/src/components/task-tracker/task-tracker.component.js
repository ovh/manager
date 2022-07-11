import controller from './task-tracker.controller';
import template from './task-tracker.template.html';

export default {
  bindings: {
    endpoint: '<',
    goBack: '<',
    operation: '<',
    params: '<',
    tasks: '<',
  },
  controller,
  template,
};
