import controller from './task-tracker.controller';
import template from './task-tracker.template.html';

export default {
  bindings: {
    goBack: '<',
    operation: '<',
    params: '<',
    taskApiUrl: '<',
    tasks: '<',
  },
  controller,
  template,
};
