import controller from './dashboard.controller';
import template from './dashboard.html';
import './dashboard.scss';

export default {
  controller,
  template,
  bindings: {
    usage: '<',
    currencySymbol: '<',
    trainingFeatures: '<',
    registry: '<',
    goToJobSubmit: '<',
    goToDataCreate: '<',
    goToDashboard: '<',
    dashboardLink: '<',
    goToRegistryAttach: '<',
    registryAttachLink: '<',
    goToRegistryDetach: '<',
    registryDetachLink: '<',
    installLink: '<',
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
