import controller from './replications.controller';
import template from './replications.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDashboard: '<',
    goToAddReplication: '<',
    goToDeleteReplication: '<',
    goToEditReplication: '<',
    refreshReplications: '<',
    replicationsList: '<',
    serviceIntegrationList: '<',
    readyServiceIntegrationList: '<',
  },
  controller,
  template,
};
