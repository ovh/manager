import controller from './add.controller';
import template from './add.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    integrationCapabilities: '<',
    servicesList: '<',
    serviceIntegrationList: '<',
    goToAddDatabase: '<',
  },
  template,
  controller,
};

export default component;
