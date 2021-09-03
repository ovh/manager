import controller from './delete-database.controller';
import template from './delete-database.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    database: '<',
    goBack: '<',
    trackDatabases: '<',
    trackingPrefix: '<',
  },
};
