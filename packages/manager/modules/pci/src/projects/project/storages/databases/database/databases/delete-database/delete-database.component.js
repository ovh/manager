import controller from './delete-database.controller';
import template from './delete-database.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    dbInstance: '<',
  },
  template,
  controller,
};

export default component;
