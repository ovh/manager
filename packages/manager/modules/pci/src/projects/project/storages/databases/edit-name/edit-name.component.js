import controller from './edit-name.controller';
import template from './edit-name.html';

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
