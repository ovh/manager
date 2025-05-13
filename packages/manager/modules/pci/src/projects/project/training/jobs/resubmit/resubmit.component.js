import controller from './resubmit.controller';
import template from './resubmit.html';

export default {
  controller,
  template,
  bindings: {
    goToJobs: '<',
    goToJobInfo: '<',
    job: '<',
    resubmitJob: '<',
    previousState: '<',
  },
};
