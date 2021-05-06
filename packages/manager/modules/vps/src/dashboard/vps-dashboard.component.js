import controller from './vps-dashboard.controller';
import template from './vps-dashboard.html';

export default {
  bindings: {
    features: '<',
    resiliationCapability: '<',

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
    goToVpsMigration: '<',
    goBack: '<',

    hasBackupStorage: '<',
    canScheduleMigration: '<',
    isVpsNewRange: '<',
    plan: '<',
    serviceName: '<',
    stateVps: '<',
    tabSummary: '<',
    vps: '<',
    vpsMigrationTask: '<',
    vpsMigrationTaskInError: '<',
    vpsUpgradeTask: '<',
  },
  controller,
  name: 'ovhManagerVpsDashboard',
  template,
};
