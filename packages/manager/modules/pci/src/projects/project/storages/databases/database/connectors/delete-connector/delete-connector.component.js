import controller from './delete-connector.controller';
import template from './delete-connector.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    connector: '<',
  },
  template,
  controller,
};

export default component;
