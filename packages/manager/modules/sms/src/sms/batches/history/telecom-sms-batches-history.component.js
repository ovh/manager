import controller from './telecom-sms-batches-history.controller';
import template from './telecom-sms-batches-history.html';

export default {
  bindings: {
    batches: '<completedBatches',
    batchStatuses: '<',
    cancelBatch: '<',
    formatStatus: '<',
    getBatches: '<',
    goBack: '<',
    goToCancelBatch: '<',
    goToDashboard: '<',
    goToDetails: '<',
    serviceName: '<',
    trackClick: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesHistoryComponent',
  template,
};
