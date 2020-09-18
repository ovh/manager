import controller from './telecom-sms-batches-history-cancel.controller';
import template from './telecom-sms-batches-history-cancel.html';

export default {
  bindings: {
    batch: '<',
    cancelBatch: '<',
    displayErrorMessage: '<',
    displaySuccessMessage: '<',
    goBack: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchCancel',
  template,
};
