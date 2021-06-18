import controller from './workflow.controller';
import template from './workflow.html';

export default {
  bindings: {
    add: '<',
    goToDeleteWorkflowPage: '<',
    goToExecutionsPage: '<',
    goToInstancePage: '<',
    guideUrl: '<',
    project: '<',
    projectId: '<',
    workflows: '<',
    workflowId: '<',
    onListParamChange: '<',
  },
  controller,
  template,
};
