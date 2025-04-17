import template from './dashboard.html';

export default {
  bindings: {
    notebook: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    reloadState: '<',
    needRefresh: '<',
    killTasks: '<',
    waitNotebookToStartOrStop: '<',
    currentActiveLink: '<',
    generalInformationLink: '<',
    attachDataLink: '<',
    goToUsersAndTokens: '<',
    customerRegions: '<',
    notebooksRegions: '<',
    trackNotebooks: '<',
  },
  template,
};
