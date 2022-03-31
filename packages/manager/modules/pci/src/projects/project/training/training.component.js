import controller from './training.controller';
import template from './training.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    jobInfoLink: '<',
    jobsLink: '<',
    registriesLink: '<',
    currentActiveLink: '<',
    allUsers: '<',
    regions: '<',
    refreshState: '<',
    trainingFeatures: '<',
    goToJobSubmit: '<',
    goToDashboard: '<',
    dashboardLink: '<',
    submitJobLink: '<',
    billingLink: '<',
    jobInfo: '<',
    jobKill: '<',
    userLink: '<',
    getPrice: '<',
    getTax: '<',
    steins: '<',
    customerRegions: '<',
    jobListRegions: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
  },
};
