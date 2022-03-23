import controller from './add-connector.controller';
import template from './add-connector.html';
import './add-connector.scss';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDatabases: '<',
    trackDashboard: '<',
    goBack: '<',
    availableConnector: '<',
  },
  controller,
  template,
};
