import './job-logs.scss';
import controller from './job-logs.controller';
import template from './job-logs.html';

export default {
  template,
  controller,
  bindings: {
    job: '<',
    projectId: '<',
    redirectToObjectStorage: '<',
  },
};
