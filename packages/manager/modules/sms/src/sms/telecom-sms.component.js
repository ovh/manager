import controller from './telecom-sms.controller';
import template from './telecom-sms.html';

export default {
  controller,
  template,
  bindings: {
    batches: '<',
    getBatches: '<',
    service: '<',
    isSmppAccount: '<',
    serviceName: '<',
    smsFeatureAvailability: '<',
    trackClick: '<',
    user: '<',
    headerGuideLink: '<',
  },
};
