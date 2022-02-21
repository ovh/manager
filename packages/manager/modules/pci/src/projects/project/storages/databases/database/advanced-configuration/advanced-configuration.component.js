import controller from './advanced-configuration.controller';
import template from './advanced-configuration.html';

export default {
  bindings: {
    database: '<',
    projectId: '<',
    trackDashboard: '<',
    advancedConfiguration: '<',
    advancedConfigurationList: '<',
    goBackToAdvancedConfiguration: '<',
  },
  controller,
  template,
};
