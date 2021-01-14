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
    statistics: '<',
  },
  controller,
  name: 'ovhManagerVpsDashboard',
  template,
};
