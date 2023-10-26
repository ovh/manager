import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    loadbalancer: '<',
    flavor: '<',
    network: '<',
    subnet: '<',
    openEditNameModal: '<',
  },
  controller,
  template,
};
