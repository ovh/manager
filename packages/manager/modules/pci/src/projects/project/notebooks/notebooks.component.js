import controller from './notebooks.controller';
import template from './notebooks.html';

export default {
  bindings: {
    goToAddNotebook: '<',
    goToNotebook: '<',
    goToAttachData: '<',
    goToDeleteNotebook: '<',
    reloadState: '<',
    guideUrl: '<',
    notebookLink: '<',
    notebooks: '<',
    pollNotebookStatus: '<',
    projectId: '<',
    stopPollingNotebookStatus: '<',
    trackNotebooks: '<',
    trackClick: '<',
  },
  controller,
  template,
};
