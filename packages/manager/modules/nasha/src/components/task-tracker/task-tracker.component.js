import controller from './task-tracker.controller';
import template from './task-tracker.template.html';
import './task-tracker.styles.scss';

export default {
  bindings: {
    goBack: '<',
    operation: '<',
    params: '<',
    taskApiUrl: '<',
    tasks: '<',
    trackClick: '<',
    trackingData: '<',
  },
  controller,
  template,
};
