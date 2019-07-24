import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    goToHomePage: '<',
    instance: '<',
    projectId: '<',
    workflow: '<',
    workflowId: '<',
  },
  controller,
  template,
};

export default component;
