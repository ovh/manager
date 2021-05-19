import controller from './notebooks.controller';
import template from './notebooks.html';

export default {
  bindings: {
    goToAddNotebook: '<',
    notebookLink: '<',
    goToNotebook: '<',
    goToAttachData: '<',
    goToDeleteNotebook: '<',
    reloadState: '<',
    guideUrl: '<',
    notebooks: '<',
    projectId: '<',
    trackNotebooks: '<',
    trackClick: '<',
  },
  controller,
  template,
};
