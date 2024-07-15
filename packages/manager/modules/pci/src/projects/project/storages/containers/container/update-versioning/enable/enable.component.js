import controller from './enable.controller';
import template from './enable.html';

export default {
  controller,
  template,
  bindings: {
    container: '<',
    containerId: '<',
    goBack: '<',
    projectId: '<',
    trackingPrefix: '<',
  },
};
