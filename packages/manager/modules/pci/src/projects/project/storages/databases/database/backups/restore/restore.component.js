import controller from './restore.controller';
import template from './restore.html';

const component = {
  bindings: {
    backupInstance: '<',
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDatabases: '<',
  },
  controller,
  template,
};

export default component;
