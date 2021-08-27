import controller from './create-database.controller';
import template from './create-database.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDatabases: '<',
  },
  template,
  controller,
};

export default component;
