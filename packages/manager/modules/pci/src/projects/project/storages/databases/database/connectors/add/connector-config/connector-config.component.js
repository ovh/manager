import controller from './connector-config.controller';
import template from './connector-config.html';
import './connector-config.scss';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    goBack: '<',
    connectorConfig: '<',
  },
  controller,
  template,
};
