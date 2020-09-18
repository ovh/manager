import controller from './telecom-sms-batches-history.controller';
import template from './telecom-sms-batches-history.html';

export default {
  bindings: {
    batches: '<activeBatches',
    batchStatuses: '<',
    cancelBatch: '<',
    getDashboardHref: '<',
    getBatches: '<',
    getDetailsHref: '<',
    goBack: '<',
    goToCancelBatch: '<',
    serviceName: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesHistoryComponent',
  template,
};
