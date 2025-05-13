import template from './edit.html';
import controller from './edit.controller';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    databaseId: '<',
    pool: '<',
    postgresDatabases: '<',
    users: '<',
    goBack: '<',
    trackDashboard: '<',
  },
  controller,
  template,
};
