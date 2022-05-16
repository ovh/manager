import controller from './service-integration.controller';
import template from './service-integration.html';

export default {
  bindings: {
    projectId: '<',
    databases: '<',
    database: '<',
    trackDashboard: '<',
    goToAddServiceIntegration: '<',
    goToDeleteServiceIntegration: '<',
    refreshServiceIntegration: '<',
    serviceIntegrationList: '<',
    servicesList: '<',
    stopPollingIntegrationsStatus: '<',
    replicationsList: '<',
    integrationCapabilities: '<',
    goToDatabase: '<',
  },
  controller,
  template,
};
