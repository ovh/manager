import controller from './workflow.controller';
import template from './workflow.html';

export default {
  bindings: {
    add: '<',
    goToDeleteWorkflowPage: '<',
    goToExecutionsPage: '<',
    goToInstancePage: '<',
    project: '<',
    projectId: '<',
    workflows: '<',
  },
  controller,
  template,
};
