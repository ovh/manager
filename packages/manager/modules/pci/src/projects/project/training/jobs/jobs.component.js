import controller from './jobs.controller';
import template from './jobs.html';

export default {
  controller,
  template,
  bindings: {
    job: '<',
    jobInfo: '<',
    jobKill: '<',
    submitJobLink: '<',
    submitJob: '<',
    regions: '<',
    jobInfoLink: '<',
    refreshState: '<',
    jobList: '<',
    getPrice: '<',
    user: '<',
    goToJobSubmit: '<',
  },
};
