import controller from './kill.controller';
import template from './kill.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    job: '<',
    jobId: '<',
    projectId: '<',
  },
};
