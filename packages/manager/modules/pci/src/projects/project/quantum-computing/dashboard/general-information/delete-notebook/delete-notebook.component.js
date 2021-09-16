import controller from './delete-notebook.controller';
import template from './delete-notebook.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    goToQuantumComputing: '<',
    notebook: '<',
    projectId: '<',
    trackQuantumComputing: '<',
  },
};
