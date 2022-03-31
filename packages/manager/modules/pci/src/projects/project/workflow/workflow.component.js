import controller from './workflow.controller';
import template from './workflow.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    add: '<',
    goToDeleteWorkflowPage: '<',
    goToExecutionsPage: '<',
    goToInstancePage: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    project: '<',
    projectId: '<',
    workflows: '<',
    workflowId: '<',
    onListParamChange: '<',
  },
  controller,
  template,
};
