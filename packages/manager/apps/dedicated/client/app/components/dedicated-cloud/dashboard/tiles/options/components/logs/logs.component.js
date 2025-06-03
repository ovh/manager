import template from './logs.html';
import controller from './logs.controller';

export default {
  bindings: {
    currentService: '<',
    deactivateLogs: '<',
  },
  name: 'ovhManagerPccDashboardOptionsLogs',
  template,
  controller,
};
