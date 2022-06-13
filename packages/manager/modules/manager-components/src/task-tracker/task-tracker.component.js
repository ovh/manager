import controller from './task-tracker.controller';
import template from './task-tracker.template.html';
import './task-tracker.styles.less';

export default {
  bindings: {
    task: '=',
    initLabel: '@',
    todoLabel: '@',
    doingLabel: '@',
    doneLabel: '@',
    errorLabel: '@',
    heading: '@',
    onDone: '&',
    endpoint: '@',
    interval: '<',
  },
  controller,
  template,
  transclude: {
    header: '?taskTrackerHeader',
    footer: '?taskTrackerFooter',
  },
};
