import controller from './dedicatedCloud-datacenter-zerto-alerts.controller';
import template from './dedicatedCloud-datacenter-zerto-alerts.html';

export default {
  bindings: {
    currentZerto: '<',
    currentUser: '<',
    currentState: '<?',
    goToVpnConfiguration: '<',
    pccType: '<',
  },
  controller,
  name: 'ovhManagerDedicatedCloudDatacenterZertoAlerts',
  template,
};
