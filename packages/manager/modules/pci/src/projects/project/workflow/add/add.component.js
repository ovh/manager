import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    initialStep: '<',
    regions: '<',
    instances: '<',
    selectedInstance: '<',
    cancelLink: '<',
    catalogEndpoint: '<',
    isWorkflowSupportedOnRegion: '<',
    goToHomePage: '<',
    goToInstancePage: '<',
  },
  controller,
  template,
};
