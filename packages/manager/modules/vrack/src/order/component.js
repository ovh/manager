import template from './order.html';
import controller from './controller';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    cart: '<',
    vrackContracts: '<',
    isVrackOrderAutoPayAvailable: '<',
  },
};
