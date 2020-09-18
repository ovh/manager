import controller from './telecom-sms-batches-cancel.controller';
import template from './telecom-sms-batches-cancel.html';

export default {
  bindings: {
    batch: '<',
    cancelBatch: '<',
    goBack: '<',
    onFinish: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchCancel',
  template,
};
