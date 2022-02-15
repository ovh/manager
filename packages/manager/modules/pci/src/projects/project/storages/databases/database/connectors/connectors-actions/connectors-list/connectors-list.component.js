import controller from './connectors-list.controller';
import template from './connectors-list.html';

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
