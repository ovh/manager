import controller from './jobs.controller';
import template from './jobs.html';

export default {
  controller,
  template,
  bindings: {
    job: '<',
    projectId: '<',
    jobInfo: '<',
    jobKill: '<',
    jobResubmit: '<',
    submitJobLink: '<',
    submitJob: '<',
    regions: '<',
    jobInfoLink: '<',
    refreshState: '<',
    getPrice: '<',
    user: '<',
    goToJobSubmit: '<',
    jobId: '<',
    onListParamChange: '<',
  },
};
