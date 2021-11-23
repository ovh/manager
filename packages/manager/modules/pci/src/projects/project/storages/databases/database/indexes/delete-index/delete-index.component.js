import controller from './delete-index.controller';
import template from './delete-index.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    index: '<',
  },
  template,
  controller,
};

export default component;
