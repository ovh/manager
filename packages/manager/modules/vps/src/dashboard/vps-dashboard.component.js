import controller from './vps-dashboard.controller';
import template from './vps-dashboard.html';

export default {
  bindings: {
    features: '<',

    goToDisplayIps: '<',
    goToKvm: '<',
    goToMonitoringSla: '<',
    goToReboot: '<',
    goToRebootRescue: '<',
    goToReinstall: '<',
    goToReverseDns: '<',
    goToSnapshotDelete: '<',
    goToSnapshotTake: '<',
    goToSnapshotRestore: '<',
    goToTerminateOption: '<',

    plan: '<',
    serviceName: '<',
    stateVps: '<',
    tabSummary: '<',
    vps: '<',
  },
  controller,
  name: 'ovhManagerVpsDashboard',
  template,
};
