import controller from './fork.controller';
import template from './fork.html';

const component = {
  bindings: {
    backupInstance: '<',
    database: '<',
    goBack: '<',
    goToFork: '<',
    projectId: '<',
    trackDashboard: '<',
  },
  controller,
  template,
};

export default component;
