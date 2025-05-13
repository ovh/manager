import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentDefault',
  controller,
  template,
  bindings: {
    defaultPaymentMethod: '<',
    viewOptions: '<',
  },
};
