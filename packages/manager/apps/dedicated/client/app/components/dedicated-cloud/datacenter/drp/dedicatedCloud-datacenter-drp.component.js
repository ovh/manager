import controller from './dedicatedCloud-datacenter-drp.controller';
import template from './dedicatedCloud-datacenter-drp.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
    datacenterHosts: '<',
    datacenterList: '<',
    goToConfiguration: '<',
    goToSummary: '<',
    goToVpnConfiguration: '<',
    pccType: '<',
    selectedDrpType: '<?',
    storedDrpInformations: '<?',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrp',
  template,
};
