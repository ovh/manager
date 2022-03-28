import controller from './connectors.controller';
import template from './connectors.html';
import './connectors.scss';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    connectorsList: '<',
    goToAdd: '<',
    goToEdit: '<',
    goToDelete: '<',
    goToTasks: '<',
    goToIntegrations: '<',
    serviceIntegrationList: '<',
  },
  controller,
  template,
};
