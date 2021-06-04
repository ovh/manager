import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    notebook: '<',
    flavors: '<',
    projectId: '<',
    trackNotebooks: '<',
    goToAddTag: '<',
    goToAttachData: '<',
    goToStartNotebook: '<',
    goToStopNotebook: '<',
    goToDeleteNotebook: '<',
  },
  controller,
  template,
};
