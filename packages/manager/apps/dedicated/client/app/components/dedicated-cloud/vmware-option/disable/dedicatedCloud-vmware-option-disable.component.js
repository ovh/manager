import controller from './dedicatedCloud-vmware-option-disable.controller';
import template from './dedicatedCloud-vmware-option-disable.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    option: '<',
    productId: '<',
  },
  name: 'ovhManagerPccVmwareOptionDisable',
};
