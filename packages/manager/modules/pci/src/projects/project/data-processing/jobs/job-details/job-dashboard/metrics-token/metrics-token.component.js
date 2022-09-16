import template from './metrics-token.html';
import controller from './metrics-token.controller';

const component = {
  bindings: {
    goBack: '<',
    projectId: '<',
    jobId: '<',
    job: '<',
    metricsToken: '<',
  },
  template,
  controller,
};

export default component;
