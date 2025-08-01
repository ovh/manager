import template from './logs.html';
import controller from './logs.controller';

export default {
  bindings: {
    currentService: '<',
    onDeactivateLogs: '<',
  },
  name: 'ovhManagerPccDashboardOptionsLogs',
  template,
  controller,
};
