import controller from './sms-composition.controller';
import template from './sms-composition.html';

export default {
  bindings: {
    model: '=',
    user: '<',
  },
  controller,
  name: 'ovhManagerSmsSmsComposition',
  template,
};
