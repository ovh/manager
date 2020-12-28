import controller from './sms-estimate.controller';
import template from './sms-estimate.html';

export default {
  bindings: {
    model: '<',
    service: '<',
  },
  controller,
  name: 'ovhManagerSmsSmsEstimate',
  template,
};
