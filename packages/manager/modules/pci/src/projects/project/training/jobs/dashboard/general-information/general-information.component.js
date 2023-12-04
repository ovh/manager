import controller from './general-information.controller';
import template from './general-information.html';

export default {
  controller,
  template,
  bindings: {
    job: '<',
    goToJobKill: '<',
    goToJobResubmit: '<',
    // user: '<',
    getCatalogEntryF: '<',
    goToAttachData: '<',
    refreshState: '<',
    projectId: '<',
    jobId: '<',
    jobInfo: '<',
    jobLogs: '<',
    currentActiveLink: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    goToJobDelete: '<',
  },
};
