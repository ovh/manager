import controller from './regenerate-tokens.controller';
import template from './regenerate-tokens.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    stream: '<',
    goBack: '<',
  },
};
