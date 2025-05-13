import controller from './create-pattern.controller';
import template from './create-pattern.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
  },
  template,
  controller,
};

export default component;
