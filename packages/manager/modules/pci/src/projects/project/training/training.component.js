import controller from './training.controller';
import template from './training.html';

export default {
  controller,
  template,
  bindings: {
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
  },
};
