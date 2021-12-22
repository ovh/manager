import template from './add.html';
import controller from './add.controller';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    databaseId: '<',
    postgresDatabases: '<',
    users: '<',
    goBack: '<',
    trackDashboard: '<',
  },
  controller,
  template,
};
