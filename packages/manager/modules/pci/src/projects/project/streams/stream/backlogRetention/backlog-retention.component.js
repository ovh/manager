import controller from './backlog-retention.controller';
import template from './backlog-retention.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    stream: '<',
    goBack: '<',
  },
};
