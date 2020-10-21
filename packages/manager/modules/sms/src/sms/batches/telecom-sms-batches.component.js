import controller from './telecom-sms-batches.controller';
import template from './telecom-sms-batches.html';

export default {
  bindings: {
    smsFeatureAvailability: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesComponent',
  template,
};
