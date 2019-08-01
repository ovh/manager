import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    cancelLink: '<',
    goToHomePage: '<',
    goToInstancePage: '<',
    initialStep: '<',
    instances: '<',
    isWorkflowSupportedOnRegion: '<',
    projectId: '<',
    regions: '<',
    selectedInstance: '<',
  },
  controller,
  template,
};
