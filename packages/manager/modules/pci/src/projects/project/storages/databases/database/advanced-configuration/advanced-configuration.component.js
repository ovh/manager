import controller from './advanced-configuration.controller';
import template from './advanced-configuration.html';
import './advanced-configuration.scss';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    advancedConfiguration: '<',
    advancedConfigurationList: '<',
  },
  controller,
  template,
};
