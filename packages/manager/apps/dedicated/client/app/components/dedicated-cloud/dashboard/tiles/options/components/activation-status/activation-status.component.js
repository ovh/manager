import controller from './activation-status.controller';
import template from './activation-status.html';

export default {
  bindings: {
    statusName: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardComponentActivationStatus',
  template,
};
