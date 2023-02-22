import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    allowedIps: '<',
    billingLink: '<',
    database: '<',
    databases: '<',
    getCurrentPlan: '<',
    getCurrentFlavor: '<',
    users: '<',
    goToAddNode: '<',
    goToDeleteNode: '<',
    goToAllowedIPs: '<',
    goToManagerUsers: '<',
    goToDeleteDatabase: '<',
    goToConfirmDeleteDatabase: '<',
    goToEditName: '<',
    goToUpgradePlan: '<',
    goToUpgradeVersion: '<',
    goToUpgradeNode: '<',
    goToUpgradeStorage: '<',
    goToBackups: '<',
    goToMaintenances: '<',
    goToFork: '<',
    goToIntegrations: '<',
    goToSupportPage: '<',
    vRack: '<',
    vRackLink: '<',
    latestPlan: '<',
    latestVersion: '<',
    highestFlavor: '<',
    newDatabases: '<',
    pollDatabaseStatus: '<',
    privateNetwork: '<',
    projectId: '<',
    stopPollingDatabaseStatus: '<',
    stopPollingNodesStatus: '<',
    subnet: '<',
    trackDatabases: '<',
    trackDashboard: '<',
    nodesPerRow: '<',
    isFeatureActivated: '<',
    serviceIntegration: '<',
    goBacktoGeneralInformation: '<',
    showPaymentWarning: '<',
    maintenances: '<',
    backups: '<',
    engines: '<',
  },
  controller,
  template,
};
