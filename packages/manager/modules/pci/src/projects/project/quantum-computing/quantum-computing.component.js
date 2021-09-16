import controller from './quantum-computing.controller';
import template from './quantum-computing.html';

export default {
  bindings: {
    projectId: '<',
    goToAddNotebook: '<',
    goToNotebook: '<',
    goToAttachData: '<',
    goToDeleteNotebook: '<',
    isAuthorized: '<',
    reloadState: '<',
    guideUrl: '<',
    notebookLink: '<',
    notebooks: '<',
    startNotebook: '<',
    stopNotebook: '<',
    pollNotebookStatus: '<',
    stopPollingNotebookStatus: '<',
    trackQuantumComputing: '<',
    trackClick: '<',
  },
  controller,
  template,
};
