import controller from './databases.controller';
import template from './databases.html';

export default {
  bindings: {
    databaseGuideUrl: '<',
    goToAddDatabase: '<',
    databaseLink: '<',
    goToDatabase: '<',
    goToDeleteDatabase: '<',
    guideUrl: '<',
    databases: '<',
    projectId: '<',
    trackDatabases: '<',
  },
  controller,
  template,
};
