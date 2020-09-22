import controller from './telecom-sms-batches-history-details.controller';
import template from './telecom-sms-batches-history-details.html';

export default {
  bindings: {
    batch: '<',
    getOutgoingSms: '<',
    getPttDetails: '<',
    goBack: '<',
    goToDelete: '<',
    outgoingSms: '<',
    serviceName: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesHistoryDetailsComponent',
  template,
};
