import controller from './dedicatedCloud-vmware-option-order.controller';
import template from './dedicatedCloud-vmware-option-order.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    option: '<',
    productId: '<',
  },
  name: 'ovhManagerPccVmwareOptionOrder',
};
