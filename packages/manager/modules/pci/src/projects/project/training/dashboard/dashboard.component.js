import controller from './dashboard.controller';
import template from './dashboard.html';
import './dashboard.scss';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    usage: '<',
    currencySymbol: '<',
    trainingFeatures: '<',
    registry: '<',
    goToJobSubmit: '<',
    goToDashboard: '<',
    dashboardLink: '<',
    goToInstallDetails: '<',
    goToRegistryDetails: '<',
    jobList: '<',
    refreshState: '<',
    submitJobLink: '<',
    saveRegistry: '<',
    deleteRegistry: '<',
    billingLink: '<',
    jobInfo: '<',
    jobKill: '<',
    jobInfoLink: '<',
    allUsers: '<',
    userLink: '<',
    goToJobs: '<',
    regions: '<',
  },
};
