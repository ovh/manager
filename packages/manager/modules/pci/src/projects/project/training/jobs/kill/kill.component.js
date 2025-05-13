import controller from './kill.controller';
import template from './kill.html';

export default {
  controller,
  template,
  bindings: {
    goToJobs: '<',
    goToJobInfo: '<',
    job: '<',
    killJob: '<',
    previousState: '<',
  },
};
