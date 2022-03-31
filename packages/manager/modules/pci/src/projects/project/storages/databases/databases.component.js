import controller from './databases.controller';
import template from './databases.html';

export default {
  bindings: {
    goToAddDatabase: '<',
    databaseLink: '<',
    goToDatabase: '<',
    goToDeleteDatabase: '<',
    goToConfirmDeleteDatabase: '<',
    goToEditName: '<',
    goToUpgradePlan: '<',
    goToUpgradeVersion: '<',
    goToUpgradeNode: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    engines: '<',
    databaseId: '<',
    databases: '<',
    onListParamChange: '<',
    projectId: '<',
    trackDatabases: '<',
    nodesPerRow: '<',
    showPaymentWarning: '<',
    steins: '<',
    customerRegions: '<',
    databasesRegions: '<',
  },
  controller,
  template,
};
