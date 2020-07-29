import controller from './jobs.controller';
import template from './jobs.html';

export default {
  controller,
  template,
  bindings: {
    jobList: '<',
    job: '<',
    jobInfo: '<',
    jobKill: '<',
    submitJobLink: '<',
    submitJob: '<',
    allUsers: '<',
    regions: '<',
    jobInfoLink: '<',
    refreshState: '<',
    getClassForState: '<',
  },
};
