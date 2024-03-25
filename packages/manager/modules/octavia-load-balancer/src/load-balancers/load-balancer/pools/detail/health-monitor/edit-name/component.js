import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    loadbalancer: '<',
    region: '<',
    healthMonitor: '<',
    goToDashboard: '<',
  },
  controller,
  template,
};
