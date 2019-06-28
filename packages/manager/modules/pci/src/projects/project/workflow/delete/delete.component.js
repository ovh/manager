import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    goToHomePage: '<',
    workflowId: '<',
    projectId: '<',
    instance: '<',
    workflow: '<',
  },
  template,
  controller,
};

export default component;
