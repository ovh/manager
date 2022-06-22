import controller from './task-tracker.controller';
import template from './task-tracker.template.html';

export default {
  bindings: {
    doingLabel: '@',
    doneLabel: '@',
    endpoint: '@',
    errorLabel: '@',
    heading: '@',
    interval: '<?',
    onDone: '&',
    task: '=?',
    taskId: '@',
    todoLabel: '@',
  },
  controller,
  template,
  transclude: {
    header: '?taskTrackerHeader',
    footer: '?taskTrackerFooter',
  },
};
