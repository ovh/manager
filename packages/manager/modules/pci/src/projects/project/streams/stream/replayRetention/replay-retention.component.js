import controller from './replay-retention.controller';
import template from './replay-retention.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    stream: '<',
    goBack: '<',
  },
};
