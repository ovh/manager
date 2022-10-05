import controller from './home.controller';
import template from './home.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    trackingPrefix: '<',
    aiItems: '<',
    aiUsers: '<',
    aiTokens: '<',
  },
};
