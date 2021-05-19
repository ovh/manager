import controller from './notebooks.controller';
import template from './notebooks.html';

export default {
  bindings: {
    goToAddNotebook: '<',
    notebookLink: '<',
    goToNotebook: '<',
    goToDeleteNotebook: '<',
    guideUrl: '<',
    notebooks: '<',
    projectId: '<',
    trackNotebooks: '<',
  },
  controller,
  template,
};
