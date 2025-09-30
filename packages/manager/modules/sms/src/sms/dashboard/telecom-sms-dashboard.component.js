import controller from './telecom-sms-dashboard.controller';
import template from './telecom-sms-dashboard.html';

export default {
  bindings: {
    batches: '<completedBatches',
    service: '<',

    getBatchesStatistics: '<',
    getReloadCreditLink: '<',

    goToCreditTransfer: '<',
    goToOrderTime2Chat: '<',
    goToCreditOrder: '<',

    trackClick: '<',
    serviceName: '<',

    isSmppAccount: '<',
    smsFeatureAvailability: '<',
  },
  controller,
  name: 'ovhManagerSmsDashboard',
  template,
};
