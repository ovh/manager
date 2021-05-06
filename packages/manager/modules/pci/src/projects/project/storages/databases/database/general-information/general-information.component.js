import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    allowedIps: '<',
    billingLink: '<',
    database: '<',
    getCurrentPlan: '<',
    goToAddNode: '<',
    goToAllowedIPs: '<',
    goToDeleteDatabase: '<',
    goToEditName: '<',
    goToUpgradePlan: '<',
    goToUpgradeVersion: '<',
    latestPlan: '<',
    latestVersion: '<',
    newDatabases: '<',
    pollDatabaseStatus: '<',
    privateNetwork: '<',
    projectId: '<',
    stopPollingDatabaseStatus: '<',
    stopPollingNodesStatus: '<',
    subnet: '<',
    trackDatabases: '<',
  },
  controller,
  template,
};
