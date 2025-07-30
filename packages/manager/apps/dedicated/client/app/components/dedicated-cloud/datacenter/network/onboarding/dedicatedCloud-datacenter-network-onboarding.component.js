import controller from './dedicatedCloud-datacenter-network-onboarding.controller';
import template from './dedicatedCloud-datacenter-network-onboarding.html';

export default {
  bindings: {
    network: '<',
    productId: '<',
    displaySuccessMessage: '<',
    datacenterId: '<',
  },
  controller,
  template,
};
