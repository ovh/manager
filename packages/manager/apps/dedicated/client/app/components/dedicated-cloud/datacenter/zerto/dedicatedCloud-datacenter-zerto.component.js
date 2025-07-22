import controller from './dedicatedCloud-datacenter-zerto.controller';
import template from './dedicatedCloud-datacenter-zerto.html';

export default {
  bindings: {
    currentZerto: '<',
    currentService: '<',
    currentUser: '<',
    datacenterHosts: '<',
    goToConfiguration: '<',
    goToSummary: '<',
    goToVpnConfiguration: '<',
    pccType: '<',
    selectedZertoType: '<?',
    zertoInformations: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZerto',
  template,
};
