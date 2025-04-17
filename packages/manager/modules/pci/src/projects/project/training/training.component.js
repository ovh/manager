import controller from './training.controller';
import template from './training.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    jobInfoLink: '<',
    jobsLink: '<',
    currentActiveLink: '<',
    allUsers: '<',
    regions: '<',
    refreshState: '<',
    trainingFeatures: '<',
    goToJobSubmit: '<',
    submitJobLink: '<',
    jobInfo: '<',
    jobKill: '<',
    userLink: '<',
    getPrice: '<',
    getTax: '<',
    customerRegions: '<',
    jobListRegions: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    goToUsersAndTokens: '<',
  },
};
