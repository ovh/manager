import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '<',
    messageContainer: '<',
  },
  controller,
  template,
};
