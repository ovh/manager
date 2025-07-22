import controller from './dedicatedCloud-datacenter-zerto-add-site.controller';
import template from './dedicatedCloud-datacenter-zerto-add-site.html';

export default {
  bindings: {
    zertoInformations: '<',
    goToDeleteZertoModal: '<',
    goBackToListing: '<',
    pccType: '<',
    serviceName: '<',
    datacenterId: '<',
    handleSuccess: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoAddSite',
  template,
};
