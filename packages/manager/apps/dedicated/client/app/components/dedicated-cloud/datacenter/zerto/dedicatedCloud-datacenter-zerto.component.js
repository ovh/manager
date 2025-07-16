import controller from './dedicatedCloud-datacenter-zerto.controller';
import template from './dedicatedCloud-datacenter-zerto.html';

export default {
  bindings: {
    currentZerto: '<',
    currentService: '<',
    currentUser: '<',
    datacenterHosts: '<',
    datacenterList: '<',
    goToConfiguration: '<',
    goToSummary: '<',
    goToVpnConfiguration: '<',
    pccType: '<',
    selectedZertoType: '<?',
    storedZertoInformations: '<?',
  },
  controller,
  name: 'dedicatedCloudDatacenterZerto',
  template,
};
