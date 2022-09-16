import controller from './job-status.controller';
import template from './job-status.html';

export default {
  template,
  controller,
  bindings: {
    status: '<',
  },
};
