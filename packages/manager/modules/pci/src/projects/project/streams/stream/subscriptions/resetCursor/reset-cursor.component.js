import controller from './reset-cursor.controller';
import template from './reset-cursor.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    streamId: '<',
    subscription: '<',
    goBack: '<',
  },
};
