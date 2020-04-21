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
    goBack: '<',

    hasBackupStorage: '<',
    isVpsNewRange: '<',
    plan: '<',
    serviceName: '<',
    stateVps: '<',
    tabSummary: '<',
    vps: '<',

    vpsUpgradeTask: '<',
  },
  controller,
  name: 'ovhManagerVpsDashboard',
  template,
};
