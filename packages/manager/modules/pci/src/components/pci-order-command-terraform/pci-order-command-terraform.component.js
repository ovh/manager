import controller from './pci-order-command-terraform.controller';
import template from './pci-order-command-terraform.html';

export default {
  bindings: {
    terraformData: '<',
  },
  controller,
  template,
};
