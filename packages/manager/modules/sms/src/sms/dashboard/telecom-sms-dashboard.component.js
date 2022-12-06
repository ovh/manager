import controller from './telecom-sms-dashboard.controller';
import template from './telecom-sms-dashboard.html';

export default {
  bindings: {
    batches: '<completedBatches',
    service: '<',

    getBatchesStatistics: '<',
    getReloadCreditLink: '<',

    trackClick: '<',
    serviceName: '<',

    isSmppAccount: '<',
  },
  controller,
  name: 'ovhManagerSmsDashboard',
  template,
};
