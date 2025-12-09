import controller from './sms-options.controller';
import template from './sms-options.html';

export default {
  bindings: {
    model: '=',
  },
  controller,
  name: 'ovhManagerSmsSmsOptions',
  template,
};
