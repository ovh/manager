import controller from './edit-connector-config.controller';
import template from './edit-connector-config.html';
import './edit-connector-config.scss';

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
