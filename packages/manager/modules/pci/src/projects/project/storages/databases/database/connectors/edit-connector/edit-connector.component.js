import controller from './edit-connector.controller';
import template from './edit-connector.html';
import './edit-connector.scss';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    goBack: '<',
    connector: '<',
    availableConnector: '<',
  },
  controller,
  template,
};
