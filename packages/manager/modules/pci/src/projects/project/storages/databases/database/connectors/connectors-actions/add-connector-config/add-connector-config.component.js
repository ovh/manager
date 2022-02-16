import controller from './add-connector-config.controller';
import template from './add-connector-config.html';
import './add-connector-config.scss';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    goBack: '<',
    availableConnector: '<',
  },
  controller,
  template,
};
