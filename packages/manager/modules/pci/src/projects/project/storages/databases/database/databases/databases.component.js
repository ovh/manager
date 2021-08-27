import controller from './databases.controller';
import template from './databases.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDatabases: '<',
    addDatabase: '<',
  },
  controller,
  template,
};
