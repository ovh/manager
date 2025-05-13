import controller from './delete-replication.controller';
import template from './delete-replication.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
    replication: '<',
  },
  template,
  controller,
};

export default component;
