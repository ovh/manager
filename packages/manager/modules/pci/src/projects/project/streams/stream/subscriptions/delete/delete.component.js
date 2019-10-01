import controller from './delete.controller';
import template from './delete.html';

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
