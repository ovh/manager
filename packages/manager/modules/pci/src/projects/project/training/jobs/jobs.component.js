import controller from './jobs.controller';
import template from './jobs.html';
import './jobs.scss';

export default {
  controller,
  template,
  bindings: {
    job: '<',
    jobInfo: '<',
    jobKill: '<',
    submitJobLink: '<',
    submitJob: '<',
    allUsers: '<',
    regions: '<',
    jobInfoLink: '<',
    refreshState: '<',
    jobList: '<',
    getPrice: '<',
    user: '<',
    goToJobSubmit: '<',
  },
};
