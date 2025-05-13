import controller from './telecom-sms-batches-details.controller';
import template from './telecom-sms-batches-details.html';

export default {
  bindings: {
    batch: '<',
    getOutgoingSms: '<',
    getPttDetails: '<',
    goBack: '<',
    goToStatistics: '<',
    outgoingSms: '<',
    serviceName: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesHistoryDetailsComponent',
  template,
};
