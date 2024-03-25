import controller from './resubmit.controller';
import template from './resubmit.html';

export default {
  controller,
  template,
  bindings: {
    goToJobs: '<',
    goBack: '<',
    job: '<',
    jobId: '<',
    projectId: '<',
  },
};
