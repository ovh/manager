import controller from './dedicatedCloud-datacenter-drp-alerts.controller';
import template from './dedicatedCloud-datacenter-drp-alerts.html';

export default {
  bindings: {
    currentDrp: '<',
    currentUser: '<',
    currentState: '<?',
  },
  controller,
  name: 'ovhManagerDedicatedCloudDatacenterDrpAlerts',
  template,
};
