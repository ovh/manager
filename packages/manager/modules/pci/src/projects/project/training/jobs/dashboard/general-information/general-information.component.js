import controller from './general-information.controller';
import template from './general-information.html';

export default {
  controller,
  template,
  bindings: {
    job: '<',
    goToJobKill: '<',
    goToJobResubmit: '<',
    getCatalogEntryF: '<',
    goToAttachData: '<',
    refreshState: '<',
    projectId: '<',
    jobId: '<',
    jobInfo: '<',
    jobLogs: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    goToJobDelete: '<',
  },
};
