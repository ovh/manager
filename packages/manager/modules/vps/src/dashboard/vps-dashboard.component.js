import controller from './vps-dashboard.controller';
import template from './vps-dashboard.html';

export default {
  bindings: {
    connectedUser: '<',
    engagement: '<',
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
    goToCommit: '<',
    goToCancelCommit: '<',
    goToCancelResiliation: '<',
    goToResiliation: '<',
    isCommitmentAvailable: '<',

    hasBackupStorage: '<',
    canScheduleMigration: '<',
    isVpsNewRange: '<',
    plan: '<',
    serviceInfo: '<',
    serviceName: '<',
    shouldReengage: '<',
    stateVps: '<',
    tabSummary: '<',
    trackingPrefix: '<',
    vps: '<',
    vpsState: '<',
    vpsMigrationTask: '<',
    vpsMigrationTaskInError: '<',
    vpsUpgradeTask: '<',
    canDisplayVpsAnnouncementBanner: '<',
  },
  controller,
  name: 'ovhManagerVpsDashboard',
  template,
};
