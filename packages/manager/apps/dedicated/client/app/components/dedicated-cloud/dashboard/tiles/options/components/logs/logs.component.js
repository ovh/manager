import template from './logs.html';
import controller from './logs.controller';

export default {
  bindings: {
    currentService: '<',
    onDeactivateLogs: '<',
    isDisabled: '<',
  },
  name: 'ovhManagerPccDashboardOptionsLogs',
  template,
  controller,
};
