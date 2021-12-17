import controller from './terminate.controller';
import template from './terminate.html';

const component = {
  bindings: {
    projectId: '<',
    databaseId: '<',
    pool: '<',
    goBack: '<',
  },
  template,
  controller,
};

export default component;
