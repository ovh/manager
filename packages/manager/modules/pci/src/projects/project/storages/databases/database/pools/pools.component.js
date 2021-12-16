import template from './pools.html';
import controller from './pools.controller';

export default {
  bindings: {
    projectId: '<',
    databaseId: '<',
    database: '<',
    postgresDatabases: '<',
    trackDashboard: '<',
    pools: '<',
    goBackToPools: '<',
    users: '<',
  },
  controller,
  template,
};
