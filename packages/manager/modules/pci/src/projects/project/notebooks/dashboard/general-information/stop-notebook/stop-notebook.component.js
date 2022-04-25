import controller from './stop-notebook.controller';
import template from './stop-notebook.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    goToNotebooks: '<',
    notebook: '<',
    projectId: '<',
    trackNotebooks: '<',
  },
};
