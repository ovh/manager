import template from './terminate-job.html';
import controller from './terminate-job.controller';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    jobId: '<',
    jobName: '<',
  },
  template,
  controller,
};

export default component;
