import controller from './hosting-cancel-termination.controller';
import template from './hosting-cancel-termination.html';

export default {
  controller,
  template,
  bindings: {
    serviceInfos: '<',
    alerts: '<',
    terminationDate: '<',
    hasReactivateStrategy: '<',
    goBack: '<',
    trackClick: '<',
  },
};
