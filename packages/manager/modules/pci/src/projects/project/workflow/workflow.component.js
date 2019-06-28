import controller from './workflow.controller';
import template from './workflow.html';

export default {
  bindings: {
    projectId: '<',
    add: '<',
    project: '<',
    workflows: '<',
    goToInstancePage: '<',
    goToExecutionsPage: '<',
    goToDeleteWorkflowPage: '<',
  },
  controller,
  template,
};
