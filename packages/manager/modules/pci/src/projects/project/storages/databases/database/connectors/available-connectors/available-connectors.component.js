import controller from './available-connectors.controller';
import template from './available-connectors.html';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    goBack: '<',
    goToConnectorConfig: '<',
    availableConnectors: '<',
  },
  controller,
  template,
};
