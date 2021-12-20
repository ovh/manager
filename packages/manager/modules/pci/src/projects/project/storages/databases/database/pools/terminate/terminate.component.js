import controller from './terminate.controller';
import template from './terminate.html';

const component = {
  bindings: {
    projectId: '<',
    databaseId: '<',
    pool: '<',
    goBack: '<',
    trackDashboard: '<',
  },
  template,
  controller,
};

export default component;
