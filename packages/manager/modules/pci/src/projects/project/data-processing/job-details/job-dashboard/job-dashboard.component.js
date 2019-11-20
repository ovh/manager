import './job-dashboard.scss';
import controller from './job-dashboard.controller';
import template from './job-dashboard.html';

export default {
  template,
  controller,
  bindings: {
    job: '<',
    projectId: '<',
    metricsToken: '<',
  },
};
