import controller from './fork.controller';
import template from './fork.html';

const component = {
  bindings: {
    backupInstance: '<',
    database: '<',
    goBack: '<',
    goToFork: '<',
    projectId: '<',
    trackDatabases: '<',
  },
  controller,
  template,
};

export default component;
