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
    userAndRolesLink: '<',
    steins: '<',
    customerRegions: '<',
    notebooksRegions: '<',
    trackNotebooks: '<',
  },
  template,
};
