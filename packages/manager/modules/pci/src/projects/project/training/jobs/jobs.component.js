import controller from './jobs.controller';
import template from './jobs.html';

export default {
  controller,
  template,
  bindings: {
    jobList: '<',
    job: '<',
    jobInfo: '<',
    submitJobLink: '<',
    submitJob: '<',
    allUsers: '<',
    allRegions: '<',
  },
};
