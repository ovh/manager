import controller from './attach-data.controller';
import template from './attach-data.html';

export default {
  controller,
  template,
  bindings: {
    job: '<',
    projectId: '<',
    jobId: '<',
    currentActiveLink: '<',
    trackClick: '<',
  },
};
