import controller from './dedicatedCloud-datacenter-zerto-mainPccStep.controller';
import template from './dedicatedCloud-datacenter-zerto-mainPccStep.html';

export default {
  bindings: {
    currentService: '<',
    datacenterId: '<',
    datacenters: '<datacenterList',
    defaultLocalVraNetwork: '<?',
    zertoInformations: '=',
    goBackToChoice: '<',
    goToNextStep: '<',
    ipAddressDetails: '<',
    pccType: '<',
  },
  controller,
  template,
};
