import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    notebook: '<',
    flavor: '<',
    flavors: '<',
    projectId: '<',
    trackQuantumComputing: '<',
    startNotebook: '<',
    stopNotebook: '<',
    goToAddTag: '<',
    goToAttachData: '<',
    goToStartNotebook: '<',
    goToStopNotebook: '<',
    goToDeleteNotebook: '<',
    openLiveCodeEditor: '<',
  },
  controller,
  template,
};
