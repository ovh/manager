import controller from './telecom-sms-batches-history.controller';
import template from './telecom-sms-batches-history.html';

export default {
  bindings: {
    batches: '<activeBatches',
    batchStatuses: '<',
    cancelBatch: '<',
    getDashboardHref: '<',
    getBatches: '<',
    goBack: '<',
    goToCancelBatch: '<',
    goToDetails: '<',
    serviceName: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesHistoryComponent',
  template,
};
