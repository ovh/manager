import controller from './command.controller';
import template from './command.html';

const component = {
  bindings: {
    backupId: '<',
    restoreMode: '<',
    database: '<',
    goBack: '<',
    data: '<',
    user: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
