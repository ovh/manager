import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    ipToDelete: '<',
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
  },
  controller,
  template,
};

export default component;
