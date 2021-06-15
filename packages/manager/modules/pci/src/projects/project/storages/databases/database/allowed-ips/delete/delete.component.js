import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    ipToDelete: '<',
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDatabases: '<',
  },
  controller,
  template,
};

export default component;
