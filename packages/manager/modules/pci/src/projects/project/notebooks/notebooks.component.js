import controller from './notebooks.controller';
import template from './notebooks.html';

export default {
  bindings: {
    projectId: '<',
    pciFeatureRedirect: '<',
    goToAddNotebook: '<',
    goToNotebook: '<',
    goToAttachData: '<',
    goToDeleteNotebook: '<',
    isAuthorized: '<',
    reloadState: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    notebookLink: '<',
    notebooks: '<',
    startNotebook: '<',
    stopNotebook: '<',
    pollNotebookStatus: '<',
    stopPollingNotebookStatus: '<',
    steins: '<',
    customerRegions: '<',
    notebooksRegions: '<',
    trackNotebooks: '<',
    trackClick: '<',
    goToStopNotebook: '<',
    goToUsersAndTokens: '<',
  },
  controller,
  template,
};
