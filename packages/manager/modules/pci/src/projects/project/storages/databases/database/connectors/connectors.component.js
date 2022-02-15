import controller from './connectors.controller';
import template from './connectors.html';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    connectorsList: '<',
    goToAdd: '<',
    goToEdit: '<',
    goToDelete: '<',
  },
  controller,
  template,
};
