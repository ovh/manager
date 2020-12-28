import controller from './dedicatedCloud-datacenter-drp-mainPccStep.controller';
import template from './dedicatedCloud-datacenter-drp-mainPccStep.html';

export default {
  bindings: {
    configurationStepName: '<',
    currentService: '<',
    datacenterId: '<',
    datacenters: '<datacenterList',
    defaultLocalVraNetwork: '<?',
    drpInformations: '=',
    getIpOrderLink: '<',
    goBackToChoice: '<',
    goToNextStep: '<',
    ipAddressDetails: '<',
    pccType: '<',
  },
  controller,
  template,
};
