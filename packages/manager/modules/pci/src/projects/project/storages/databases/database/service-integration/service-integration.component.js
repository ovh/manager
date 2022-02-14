import controller from './service-integration.controller';
import template from './service-integration.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDashboard: '<',
    goToAddServiceIntegration: '<',
    goToDeleteServiceIntegration: '<',
    refreshServiceIntegration: '<',
    serviceIntegrationList: '<',
    servicesList: '<',
    addableServicesList: '<',
    stopPollingIntegrationsStatus: '<',
    replicationsList: '<',
    engineName: '<',
  },
  controller,
  template,
};
