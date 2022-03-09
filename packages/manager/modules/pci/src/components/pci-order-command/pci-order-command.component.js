import controller from './pci-order-command.controller';
import template from './pci-order-command.html';
import './pci-order-command.scss';

export default {
  transclude: true,
  bindings: {
    orderApiUrl: '<',
    orderData: '<',
    parameterKeys: '<',
    helpLink: '<',
    autoHeight: '<',
  },
  controller,
  template,
};
