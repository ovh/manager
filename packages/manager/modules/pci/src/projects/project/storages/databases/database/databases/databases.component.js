import controller from './databases.controller';
import template from './databases.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDatabases: '<',
    addDatabase: '<',
    deleteDatabase: '<',
    databasesList: '<',
  },
  controller,
  template,
};
