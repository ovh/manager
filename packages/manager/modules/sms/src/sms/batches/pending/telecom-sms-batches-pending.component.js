import controller from './telecom-sms-batches-pending.controller';
import template from './telecom-sms-batches-pending.html';

export default {
  bindings: {
    batches: '<plannedBatches',
    batchStatuses: '<',
    cancelBatch: '<',
    displaySuccessMessage: '<',
    formatStatus: '<',
    getDetailsHref: '<',
    goToCancelBatch: '<',
    goToDetails: '<',
    goBack: '<',
    reloadPage: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesPendingComponent',
  template,
};
