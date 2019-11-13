import controller from './dedicatedCloud-datacenter-drp-mainPccStep.controller';
import template from './dedicatedCloud-datacenter-drp-mainPccStep.html';

export default {
  bindings: {
    currentService: '<',
    datacenterId: '<',
    datacenters: '<datacenterList',
    defaultLocalVraNetwork: '<?',
    drpInformations: '<',
    goBackToChoice: '<',
    goToNextStep: '<',
    ipAddressDetails: '<',
  },
  controller,
  template,
};
