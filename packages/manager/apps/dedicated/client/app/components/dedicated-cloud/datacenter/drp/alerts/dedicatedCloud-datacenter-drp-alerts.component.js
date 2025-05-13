import controller from './dedicatedCloud-datacenter-drp-alerts.controller';
import template from './dedicatedCloud-datacenter-drp-alerts.html';

export default {
  bindings: {
    currentDrp: '<',
    currentUser: '<',
    currentState: '<?',
    goToVpnConfiguration: '<',
    pccType: '<',
  },
  controller,
  name: 'ovhManagerDedicatedCloudDatacenterDrpAlerts',
  template,
};
