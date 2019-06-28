import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    instances: '<',
    goToHomePage: '<',
    selectedInstance: '<',
    goToInstancePage: '<',
    initialStep: '<',
    cancelLink: '<',
    regions: '<',
    isWorkflowSupportedOnRegion: '<',
  },
  controller,
  template,
};
