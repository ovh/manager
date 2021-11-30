import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    user: '<',
  },
  template,
  controller,
};

export default component;
