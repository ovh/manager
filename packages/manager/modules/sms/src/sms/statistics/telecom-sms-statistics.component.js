import controller from './telecom-sms-statistics.controller';
import template from './telecom-sms-statistics.html';

export default {
  controller,
  template,
  bindings: {
    batches: '<',
    service: '<',
    serviceName: '<',
    isSmppAccount: '<',
    goToSmsOrder: '<',
  },
};
