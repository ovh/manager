import controller from './logs.controller';
import template from './logs.html';
import './logs.scss';

export default {
  controller,
  template,
  bindings: {
    job: '<',
    projectId: '<',
    jobId: '<',
    jobLog: '<',
  },
};
