import controller from './edit-name.controller';
import template from './edit-name.html';

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
