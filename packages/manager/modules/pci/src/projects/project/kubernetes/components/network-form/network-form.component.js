import controller from './network-form.controller';
import template from './network-form.template.html';
import './network-form.styles.scss';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    privateNetworks: '<',
    privateNetwork: '=',
    subnet: '=',
    loadBalancersSubnet: '=',
    gateway: '=',
    dense: '<',
  },
  controller,
  template,
};
