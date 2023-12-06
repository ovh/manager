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
    availableEngines: '<',
    databaseId: '<',
    databases: '<',
    allDatabases: '<',
    onListParamChange: '<',
    projectId: '<',
    trackDatabases: '<',
    showPaymentWarning: '<',
    steins: '<',
    customerRegions: '<',
    databasesRegions: '<',
    type: '<',
  },
  controller,
  template,
};
