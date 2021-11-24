import controller from './confirm-delete.controller';
import template from './confirm-delete.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDatabases: '<',
    linkedServices: '<',
  },
  template,
  controller,
};

export default component;
