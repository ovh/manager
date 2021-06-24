import controller from './dedicatedCloud-datacenter-add.controller';
import template from './dedicatedCloud-datacenter-add.html';

export default {
  bindings: {
    goBack: '<',
    goUpgradeRange: '<',
    serviceName: '<',
  },
  controller,
  template,
};
