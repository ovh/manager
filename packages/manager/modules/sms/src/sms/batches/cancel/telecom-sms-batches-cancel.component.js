import controller from './telecom-sms-batches-cancel.controller';
import template from './telecom-sms-batches-cancel.html';

import './telecom-sms-batches-cancel.scss';

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
