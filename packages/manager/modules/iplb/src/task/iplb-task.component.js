import controller from './iplb-task.controller';
import template from './iplb-task.html';

export default {
  bindings: {
    goBack: '<',
    goToTaskPreview: '<',
    serviceName: '<',
  },
  controller,
  template,
};
