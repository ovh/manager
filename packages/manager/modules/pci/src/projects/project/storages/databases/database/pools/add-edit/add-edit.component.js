import template from './add-edit.html';
import controller from './add-edit.controller';

export default {
  bindings: {
    projectId: '<',
    databaseId: '<',
    pool: '<',
    postgresDatabases: '<',
    users: '<',
    goBack: '<',
  },
  controller,
  template,
};
