import controller from './delete-pattern.controller';
import template from './delete-pattern.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    pattern: '<',
  },
  template,
  controller,
};

export default component;
