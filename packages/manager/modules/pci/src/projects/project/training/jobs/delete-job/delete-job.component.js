import controller from './delete-job.controller';
import template from './delete-job.html';

export default {
  controller,
  template,
  bindings: {
    goToJobs: '<',
    goToJobInfo: '<',
    job: '<',
    jobId: '<',
    projectId: '<',
    previousState: '<',
  },
};
