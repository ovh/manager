import controller from './dedicatedCloud-datacenter-add-nsx.controller';
import template from './dedicatedCloud-datacenter-add-nsx.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    datacenterId: '<',
    nsxEdgeCurrentLevel: '<',
    hasMaximumNsx: '<',
    addNsx: '<',
    handleSuccess: '<',
    handleError: '<',
  },
  controller,
  template,
};
